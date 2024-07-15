const ProfileModel = require("../models/ProfileModel");
const CartModel = require("../models/CartModel");
const InvoiceModel = require("../models/InvoiceModel");
const InvoiceProductModel = require("../models/InvoiceProductModel");
const PaymentSettingModel = require("../models/PaymentSettingModel");
const mongoose = require("mongoose");
const FormData = require("form-data");
const axios = require("axios");

const ObjectId = mongoose.Types.ObjectId;

const CreateInvoiceService = async (req) => {
  try {
    const userId = new ObjectId(req.headers.userId);
    const email = req.headers.email;

    // step-1: calculate total payable
    let MatchStage = { $match: { userID: userId } };
    let JoinWithProductStage = {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    };
    let UnwindWithProductStage = { $unwind: "$product" };

    let CartProducts = await CartModel.aggregate([
      MatchStage,
      JoinWithProductStage,
      UnwindWithProductStage,
    ]);

    let totalAmount = 0;
    CartProducts.forEach((element) => {
      let price;
      if (element.product.discount) {
        price = parseFloat(element.product.discountPrice);
      } else {
        price = parseFloat(element.product.price);
      }
      totalAmount += parseFloat(element.qty * price);
    });

    let vat = totalAmount * 0.05; //5% vat
    let payable = totalAmount + vat;

    // step-2: cus-details & ship_details
    let Profile = await ProfileModel.aggregate([MatchStage]);
    let cus_details = `Name: ${Profile["0"].cus_name}, Email:${email}, Phone:${Profile["0"].cus_phone}, Address:${Profile["0"].cus_add}, City:${Profile["0"].cus_city}, Country:${Profile["0"].cus_country}`;
    let ship_details = `Name: ${Profile["0"].ship_name}, Email:${email}, Address:${Profile["0"].ship_add}, Postcode:${Profile["0"].ship_postcode}, City:${Profile["0"].ship_city}, Country:${Profile["0"].ship_country}`;

    // step-3: transaction id and others id
    let tran_id = Math.floor(10000000 + Math.random() * 90000000);
    let val_id = 0;
    let delivery_status = "pending";
    let peyment_status = "pending";

    //step-4: Invoice create
    let createInvoice = await InvoiceModel.create({
      userID: userId,
      payable: payable,
      cus_details: cus_details,
      ship_details: ship_details,
      tran_id: tran_id,
      val_id: val_id,
      delivery_status: delivery_status,
      payment_status: peyment_status,
      total: totalAmount,
      vat: vat,
    });

    //step-5: create invoice product list
    let invoiceId = createInvoice._id;

    CartProducts.forEach(async (element) => {
      await InvoiceProductModel.create({
        userID: userId,
        invoiceID: invoiceId,
        productID: element.productID,
        qty: element.qty,
        price: element.product.discount
          ? element.product.discountPrice
          : element.product.price,
        color: element.color,
        size: element.size,
      });
    });

    //step-6: delete cart list
    await CartModel.deleteMany({ userID: userId });

    //step-7: sslecommerce
    const PaymentSettings = await PaymentSettingModel.find();
    const form = new FormData();

    form.append("store_id", PaymentSettings[0].store_id);
    form.append("store_passwd", PaymentSettings[0].store_passwd);
    form.append("total_amount", payable.toString());
    form.append("currency", PaymentSettings[0].currency);
    form.append("tran_id", tran_id);
    form.append("success_url", `${PaymentSettings[0].success_url}/${tran_id}`);
    form.append("fail_url", `${PaymentSettings[0].fail_url}/${tran_id}`);
    form.append("cancel_url", `${PaymentSettings[0].cancel_url}/${tran_id}`);
    form.append("ipn_url", `${PaymentSettings[0].ipn_url}/${tran_id}`);

    form.append("cus_name", Profile[0].cus_name);
    form.append("cus_email", email);
    form.append("cus_add1", Profile[0].cus_add);
    form.append("cus_add2", Profile[0].cus_add);
    form.append("cus_city", Profile[0].cus_city);
    form.append("cus_state", Profile[0].cus_state);
    form.append("cus_postcode", Profile[0].cus_postcode);
    form.append("cus_country", Profile[0].cus_country);
    form.append("cus_phone", Profile[0].cus_phone);
    form.append("cus_fax", Profile[0].cus_fax);

    form.append("shipping_method", "Yes");
    form.append("ship_name", Profile[0].ship_name);
    form.append("ship_add1", Profile[0].ship_add);
    form.append("ship_add2", Profile[0].ship_add);
    form.append("ship_city", Profile[0].ship_city);
    form.append("ship_state", Profile[0].ship_state);
    form.append("ship_postcode", Profile[0].ship_postcode);
    form.append("ship_country", Profile[0].ship_country);

    form.append("product_name", "According to invoice");
    form.append("product_category", "According to invoice");
    form.append("product_profile", "According to invoice");
    form.append("product_amount", "According to invoice");

    const SSLRes = await axios.post(PaymentSettings[0].init_url, form);

    return { status: "success", data: SSLRes.data };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const PaymentFailService = async (req) => {
  try {
    let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID}, {payment_status:"fail"})
    return { status: "fail" };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const PaymentCancelService = async (req) => {
  try {
    let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID}, {payment_status:"cancel"})
    return { status: "cancel" };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const PaymentSuccessService = async (req) => {
  try {
    let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID}, {payment_status:"success"})
    return { status: "success" };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const PaymentIPNService = async (req) => {
  try {
    let trxID = req.params.trxID
    let status = req.body["status"]
    await InvoiceModel.updateOne({tran_id:trxID}, {payment_status:status})
    return { status: status };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const InvoiceListService = async (req) => {
  try {
    const userId = req.headers.userId;
    let invoice = await InvoiceModel.find({userID: userId})

    return { status: "success", data: invoice };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const InvoiceProductListService = async (req) => {
  try {
    const userId = new ObjectId(req.headers.userId);
    const invoiceId = new ObjectId(req.params.invoiceID);

    let MatchStage = {$match: {userID:userId, invoiceID:invoiceId}}
    let JoinWithProductStage = {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    };
    let UnwindWithProductStage = { $unwind: "$product" };

    let products = await InvoiceProductModel.aggregate([
      MatchStage,
      JoinWithProductStage,
      UnwindWithProductStage,
    ]);


    return { status: "success", data: products };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

module.exports = {
  CreateInvoiceService,
  PaymentFailService,
  PaymentCancelService,
  PaymentIPNService,
  PaymentSuccessService,
  InvoiceListService,
  InvoiceProductListService,
};
