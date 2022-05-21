const generateOrderCancelledEMailTemplate = ({
  username,
  cancelledDate,
  refundAmount,
  orderId,
  products,
  amountPaid,
  medCoinUsed,
  totalRefundable,
  paymentType = "cod",
  amountSaved,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="img/favi.png" type="image/x-icon" />
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon" />
    <title>Medimall | Webmail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet" />
    <link href="css/font-awesome.min.css" rel="stylesheet" />
    <style>
      span.rs::before {
        top: 7px;
        width: 26px;
        height: 1px;
        background-color: #949494;
        transform: rotate(20deg);
        content: '';
        float: right;
        right: 0;
      }
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
      /* // Extra small devices (portrait phones, less than 576px) */
      @media (max-width: 575.98px) {
        hr.hert {
          left: 267px;
        }
      }
      /* // Small devices (landscape phones, 576px and up) */
      @media (min-width: 576px) and (max-width: 767.98px) {
      }
      /* // Medium devices (tablets, 768px and up) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        hr.hert {
          left: 250px;
        }
      }
      /* // Large devices (desktops, 992px and up) */
      @media (min-width: 992px) and (max-width: 1199.98px) {
      }
      /* // Extra large devices (large desktops, 1200px and up) */
      @media (min-width: 1024px) and (max-width: 1130px) {
        hr.hert {
          left: 371px;
        }
      }
      @media (min-width: 1400px) and (max-width: 1920px) {
      }
    </style>
  </head>
  <body style="text-align:center;font-family:'Poppins', sans-serif;">
    <div class="wrapper" style="width: 100%; table-layout: fixed; padding-bottom: 20px;">
      <div
        class="webkit"
        style="margin: 0 auto;max-width: 600px;background: transparent linear-gradient(180deg , #FFFFFF 0%, #FCFEFF 83%, #ECFAFF 100%);"
      >
        <table align="center" border="0" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr class="header">
                    <td align="center" valign="top">
                      <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/index-5_bfuAzFMpX.png?updatedAt=1641348613860" class="stman" style="margin:20px 0 0 0; width:600px;" />
                    </td>
                  </tr>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:0px;">
                  <thead>
                    <tr>
                      <h1 style="margin:0;margin-bottom: 30px;font-size:30px;color: #1E1E1E; text-align: center;">
                        <span style="opacity: 0.5;font-weight: 600;">Hello</span>
                        ${username}
                      </h1>
                    </tr>
                  </thead>
                  <tr>
                    <td>
                      <div
                        class="section2"
                        style="height:auto;width:95%;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/ship-grn_qkQRr7mfF.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642851924654);border-radius:8px;opacity:1;padding:15px;"
                      >
                        <div class="greyconformation" style="width: 100px; float: left;">
                          <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/cancel-icon_LPt8QxCwn.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642851924273" style="margin:0px 15px 0px 15px; width: 62%;" />
                        </div>
                        <div class="handl" style="position:relative;text-align:left;margin:0px 0 30px 100px;">
                          <h2 style="font-size:20px;color: #fff; opacity: 1; margin-bottom: 0;    margin-top: 26px;">
                            <span style="font-weight: 400;">Your</span> Order Cancelled
                          </h2>
                          <label style="font-weight: 100;color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 15px;">On ${cancelledDate}</label>
                        </div>
                        <p style="font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">
                          We have cancelled your healthy order (order ID). Your refund will
                        </p>
                        <p style="font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">
                          be initiated soon. Please grace us with your feedback, and let us
                        </p>
                        <p style="font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">know how we can improve.</p>
                        <p style="font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">Keep Shopping With Us</p>
                        <div class="tema" style="    padding-right: 20px;text-align:right;color:#FFFFFF;opacity:0.65;margin:0 0 10px 0;">
                          <label>- Team Medimall -</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <table
                  class="main-bg-light text-center"
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="text-align:center;margin-top:0px;"
                >
                  <tr>
                    <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;margin: 60px auto;" />
                  </tr>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 0px 20px;">
                  <tr>
                    <td
                      style="background: #F2F2F2;width: 39%; padding: 20px;border-top-left-radius: 6px; border-bottom-left-radius: 6px;padding-left: 45px;"
                    >
                      <div class="payment" style="float:left;width:100%;text-align:left;border-right:1px solid #D1D1D1;">
                        <p style="margin-bottom: 0px;color:#aaa9a9;font-size:10px;font-weight: 400;">Refund Amount</p>
                        <h3 style="margin:0;color:#494949;font-size: 22px;"> ₹${amountPaid}</h3>
                        <p style="margin-top: 0px;color:#373737;opacity:0.7;font-size:9px;">
                          You Saved<span style="color:#0C90A8;opacity:0.7;"> ₹${amountSaved}</span>
                        </p>
                      </div>
                    </td>
                    <td style="background: #F2F2F2;padding: 20px;border-top-right-radius: 6px; border-bottom-right-radius: 6px;">
                      <div class="paymentimg" style="float:left;width:100%;text-align:left;margin:0 0 0 3px;">
                        <p style="color:#aaa9a9;font-size:9px;font-weight: 400;">Refund to</p>
                        <div class="imgpay">
                          <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/cash_lpkEMOX2k.png?updatedAt=1640686991098" style="margin:0 7px 0 0;width:44px;   float: left;" />
                          <label style="color:#0BBF9D;opacity:1;line-height: 3;"
                            >${
                              paymentType === "cod"
                                ? "Source of Account"
                                : paymentType === "Medcoin"
                                ? "Medcoin"
                                : "Online payment"
                            }</label
                          >
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <table
                  class="main-bg-light text-center"
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="text-align:center;margin-top:30px;"
                >
                  <tr></tr>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr class="header">
                    <td align="center" valign="top">
                      <div
                        class="packeage-details"
                        style="background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;margin:10px 0 30px 0;"
                      >
                        <div class="pack1" style="padding:9px;">
                          <div class="packhp" style="float:left;text-align:left;">
                            <h4 style="margin:0;color:#202020;opacity:1;font-size: 15px;">Cancellation Details</h4>
                            <p style="font-size: 12px;padding:0;color: #373737;opacity: 0.7;margin: 3px 0 0 0;">Healthy Order ID: #${orderId}</p>
                          </div>
                        </div>
                        <div class="pickup2" style="text-align:left;padding:52px 0px;">
                          ${products
                            .map(
                              (product) =>
                                `
               
                  <div class="cart_item_lst_row" style="width:92%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                  <div class="cart_item_lst_row_img" style="width:23%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                    <img src="${product.image}" alt="" style="width: 100%;">
                  </div>
                  <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:13px;">Qty ${product.quantity}</div>
                  <div class="cart_item_lst_row_contant" style="width:70%;float:left;height:auto;margin-left: 10px;margin-top: 8px;">
                    <div class="cart_item_lst_row_contant_name" style="">
                      <h3 style="margin:0;">${product.name}</h3>
                    </div>
                    <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">
                     ${product.description}<br>
                      
                                          </div>
                    <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                      <div class="cart_item_lst_row_contant_rate crosswith11" style="width:100%;">
                        <span class="rs" style="text-decoration:line-through;width:100%;float:left;height:auto;color:#050500;opacity:0.5;position:relative;font-size:11px;margin-top:10px;">
                           ₹${product.realPrice}
                                                  </span><br>
                        <span style="font-weight:600;">
                           ₹${product.amount}
                                                  </span>
                      </div>
                    </div>
                  </div>
                </div>

                  `
                            )
                            .toString()
                            .replace(/,/g, "")}
                        </div>
                        <div class="pick3" style="text-align:left;padding:115px 0 0px 0;">
                          <div class="refundpic">
                           ${
                             paymentType === "cod" && !medCoinUsed
                               ? ` <h4 style="padding:0 30px;line-height: 5;margin: 0;font-size: 15px;">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</h4>`
                               : ' <h4 style="padding:0 30px;line-height: 5;margin: 0;font-size: 15px;">Refundable Break-up</h4>'
                           }
                          </div>
                          <div
                            class="threebox"
                            style="background:#fff;box-shadow:0px 3px 7px #0000001c;border-radius:6px;opacity:1;padding:0 15px;text-align:center;"
                          >
                            <table style="width:100%">
                              ${
                                paymentType === "cod" && !medCoinUsed
                                  ? ""
                                  : `<tr>
                                <td>
                                  <div class="bdr" style="border-right: 2px solid #7070702b;">
                                    <h4 style="color:#202020;opacity:0.7;">Amount Paid:</h4>
                                    <p style="color:#393939;color:#343434;opacity:1;font-weight:600;">${
                                      paymentType === "cod"
                                        ? `0`
                                        : `${refundAmount}`
                                    }</p>
                                  </div>
                                </td>
                                <td>
                                  <div class="bdr" style="border-right: 2px solid #7070702b;">
                                    <h4 style="color:#202020;opacity:0.7;">MedCoins Used:</h4>
                                    <p style="color:#393939;color:#343434;opacity:1;font-weight:600;">${medCoinUsed}</p>
                                  </div>
                                </td>
                                <td>
                                  <h4 style="color:#202020;opacity:0.7;">Total Refundable:</h4>
                                  <p style="color:#393939;color:#343434;opacity:1;font-weight:600;">${totalRefundable}</p>
                                </td>
                              </tr>`
                              }
                            </table>
                          </div>
                          <div class="rfm" style="width:90%;background:#FFFFFF;border-radius:8px;opacity:0.93;margin:0 auto;padding:0 15px;">
                            <table style="width:100%">
                             ${
                               paymentType === "cod" && !medCoinUsed
                                 ? ""
                                 : `<tr>
                              <td>
                                <p class="rfh" style="color:#393939;font-size:14px;color:#202020;opacity:0.67;">
                                  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/RefundMode_C3tizNPGd.png?updatedAt=1641348612025" class="refundmode" style="float:left;" />
                                  <span style="line-height: 3;padding-left: 10px;">Refund Mode</span>
                                </p>
                              </td>
                              <td class="upi" style="text-align:right;color:#202020;opacity:1;font-size:13px;font-weight:600;">
                                ${
                                  paymentType === "Medcoin"
                                    ? `Medcoin`
                                    : `UPI / Debit Card/ Credit Card`
                                }
                              </td>
                            </tr>`
                             }
                            </table>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;" />
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr class="header">
                    <td align="center" valign="top">
                      <div
                        class="needhelp"
                        style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/quickhelp_1JALHC1DH.png?updatedAt=1640687116741);height:110px;margin:0 0px;background-repeat:no-repeat;padding:27px 55px;text-align:left;background-size:contain;"
                      >
                        <h4 style="margin-bottom: 0px;color:#181717;margin-top: 20px;font-size:18px;">Need quick help?</h4>
                        <p style="margin-top: 5px;color:#393939;font-size:13px;font-weight: 600;color: #393939;">
                          Contact our Med-executives for quick assistance.<br />
                          <a style="color: #0080FF;text-decoration: none;">help@medimall.com</a>
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr class="header">
                    <td align="center" valign="top">
                      <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_rPHk0U0c6Gs.png?updatedAt=1640687056566" class="logo" style="margin:20px 0; width:100px;" />
                    </td>
                  </tr>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr class="header">
                    <td align="center" valign="top">
                    <img
                    src="https://cybazedemo.co.in/medimall/emil/made.png"
                    class="logo"
                    style="margin:30px 0;    width: 45%;"
                  />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
`;

const generateOrderDeliveredEMailTemplate = ({
  username,
  deliveryAddress,
  returnId,
  products,
  invoiceLink,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="img/favi.png" type="image/x-icon">
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon">
    <title>Medimall | Webmail </title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <style>
      span.rs::before{position:absolute;top:7px;width:26px;height:1px;background-color:#949494;transform:rotate(20deg);content:'';float:right;right:0}
      .rate:not(:checked)>input{position:absolute;top:-9999px}
      .rate:not(:checked)>label{float:right;width:1em;overflow:hidden;white-space:nowrap;cursor:pointer;font-size:50px;color:#ccc;margin:0 15px}
      .rate:not(:checked)>label:before{content:'    '}
      .rate>input:checked~label{color:#ffc700}
      .rate:not(:checked)>label:hover{color:#deb217}
      .rate:not(:checked)>label:hover~label{color:#deb217}
      .rate>input:checked+label:hover{color:#c59b08}
      .rate>input:checked+label:hover~label{color:#c59b08}
      .rate>input:checked~label:hover{color:#c59b08}
      .rate>input:checked~label:hover~label{color:#c59b08}
      .rate>label:hover~input:checked~label{color:#c59b08}
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
              /* // Extra small devices (portrait phones, less than 576px) */
              @media (max-width: 575.98px) {
                  hr.hert {
                      left: 267px;
                  }
              }
              /* // Small devices (landscape phones, 576px and up) */
              @media (min-width: 576px) and (max-width: 767.98px) {}
              /* // Medium devices (tablets, 768px and up) */
              @media (min-width: 768px) and (max-width: 991.98px) {
                  hr.hert {
                      left: 250px;
                  }
              }
              /* // Large devices (desktops, 992px and up) */
              @media (min-width: 992px) and (max-width: 1199.98px) {}
              /* // Extra large devices (large desktops, 1200px and up) */
              @media (min-width: 1024px) and (max-width: 1130px) {
                  hr.hert {
                      left: 371px;
                  }
              }
              @media (min-width:1400px) and (max-width: 1920px) {}
    </style>
  </head>
  <body style="text-align:center;margin:0 auto;width:800px;display:block;font-family:'Poppins', sans-serif;margin: 20px auto;background: transparent linear-gradient(180deg , #FFFFFF 0%, #FCFEFF 83%, #ECFAFF 100%);">
    <table align="center" border="0" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/index8_xptTpCJH5.png?updatedAt=1641350921475" class="stman" style="margin:20px 0 0 0;width:600px;">
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <h1 style="margin:0;font-size:30px; color: #1E1E1E;margin-bottom:30px;">
                    <span style="opacity: 0.5;font-weight: 600; ">Hello</span>
                    ${username}</h1>
                </tr>
              </thead>
              <tr>
                <td>
                  <div
                  class="section2"
                  style="height:auto;width:95%;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/index-4section_N74sZoMGwBz.png?updatedAt=1641350916676);border-radius:8px;opacity:1;padding:15px;"
                  >
                  <div class="greyconformation" style="width: 115px; float: left;">
                    <img src="https://cybazedemo.co.in/medimall/emil/blue-r.png" style="margin:0px 15px 0px 15px; width: 70%;" />
                  </div>
                  <div class="handl" style="position:relative;text-align:left;margin:0px 0 30px 100px;">
                    <h2 style="font-size:20px;color: #fff; opacity: 1; margin-bottom: 0;    margin-top: 12px;">
                      <span style="font-weight: 400;">Got</span> Delivered
                    </h2>
                    <label style="color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 15px;"> Health  is on its way!!!</label>
                  </div>
                  <p style="    font-weight: 200;font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">
                    <b>Beep.. Beep...</b> Guess who’s order just got delivered?
                  </p>
                  <p style="    font-weight: 200;font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">
                    ${username},
                  </p>
                  <p style="    font-weight: 200;font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;"> The wait is
                    over! Your package of ${
                      products.length
                    } item(s) of your Medimall order </p>
                    <p style="    font-weight: 200;font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;"> 
                       ${returnId} has
                      arrived. We hope your bag of health </p>
                  <p style="    font-weight: 200;font-size: 15px;color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">brought a smile to your face.</p>
                  <div class="tema" style="text-align:right;color:#FFFFFF;opacity:0.65;margin:0 0 10px 0;">
                    <label>- Team Medimall -</label>
                  </div>
                </div>
                  
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div class="star" style="margin:30px 0;">
                    <h3 style="font-size:25px;">Rate us</h3>
                    <p style="color:#393939;color:#202020;opacity:0.7;">Tell us about your healthy experience<br>
                       with Medimall stars</p>
                   <!-- <div class="starsbox" style="background:#F2F2F2;border-radius:6px;opacity:0.76;width:427px;padding:10px 15px;height:80px;">
                      <div class="container">
                        <div class="rate" style="float:left;height:46px;padding:0 10px;">
                          <input type="radio" id="star5" name="rate" value="5"/>
                                                <label for="star5" title="text">5 stars</label>
                          <input type="radio" id="star4" name="rate" value="4"/>
                                                <label for="star4" title="text">4 stars</label>
                          <input type="radio" id="star3" name="rate" value="3"/>
                                                <label for="star3" title="text">3 stars</label>
                          <input type="radio" id="star2" name="rate" value="2"/>
                                                <label for="star2" title="text">2 stars</label>
                          <input type="radio" id="star1" name="rate" value="1"/>
                                                <label for="star1" title="text">1 star</label>
                        </div>
                      </div>
                    </div>-->
                  </div>
                </td>
              </tr>
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr class="header">
                  <td align="center" valign="top">
                    <div class="Delivery-at" style="margin-bottom: 25px;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/order_shipped/addrs_e_x88IoGSGQ.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642660748091);background-position: center;background-repeat:no-repeat;background-size:cover;text-align:left;margin-top: 23px;">
                      <div class="delivery" style="padding:32px 67px 37px 76px;">
                        <h4 style="margin-bottom: 8px;">Delivery at</h4>
                        <p style="color:#272727;opacity:0.7;margin:0px 0 1px 0;font-size: 14px;
                        height: 45px;">${deliveryAddress}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div class="packeage-details" style="    width: 95%;float: left;background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;margin:10px 0 0 0;">
                    <div class="pack1" style="padding:9px">
                      <div class="packhp" style="float:left;text-align:left;">
                        <h4 style="margin:0;color:#202020;opacity:1;font-size: 15px;
                        margin-bottom: 0px;">Package Details</h4>
                        <p style="color:#393939;font-size: 13px;padding:0;color: #373737;opacity: 0.7;margin: 2px 0 0 0;"> Healthy Order ID : #${returnId}</p>
                      </div>
                    </div>
                    ${products
                      .map(
                        (product) =>
                          `
                                     
                    <div class="pickup2" style="text-align:left;padding:52px 0px;">
                      <div class="cart_item_lst_row" style="width:93%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                        <div class="cart_item_lst_row_img" style="width:22%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                          <img src="${product.image}" alt=""  style="width: 100%;height: 100px;
                          object-fit: contain;"/>
                                        </div>
                        <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:13px;">Qty ${product.quantity}</div>
                        <div class="cart_item_lst_row_contant" style="width:70%;float:left;height:auto;margin-top:15px;margin-left: 10px;margin-top: 28px;">
                          <div class="cart_item_lst_row_contant_name" style="">
                            <h3 style="margin:0;">${product.name}</h3>
                          </div>
                          <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">${product.description}</div>
                          <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                            <div class="cart_item_lst_row_contant_rate crosswith11" style="width:101%;">
                              <span class="rs" style="width:100%;float:left;height:auto;color:#050500;opacity:0.5;position:relative;font-size:11px;margin-top:10px;">  ₹${product.realPrice} </span><br/>
                                              <span style="font-weight: 600;">  ₹${product.amount} </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      `
                      )
                      .toString()
                      .replace(/,/g, "")}
                                    
                      
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                <div class="download" style="margin:50px 0 15px 0;background:#F2F2F2;width:240px;padding:15px;border-radius:8px;">
               <a href="${invoiceLink}" style="text-decoration:none;color:black">  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/down_ryH6uecdp.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642847697303" style="float:left;margin-left: 10px;width: 25px;"><span>Download Your Invoice</span></a>
               </div>
                </td>
              </tr>
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div class="needhelp" style="background-position: center;background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/quickhelp_1JALHC1DH.png?updatedAt=1640687116741);height:110px;margin:0 0px;background-repeat:no-repeat;padding:33px 50px;text-align:left;background-size:cover;">
                    <h4 style="margin-bottom: 5px;">Need quick help?</h4>
                    <p style="margin-top: 0px;color:#393939;font-size:15px;font-weight: 600;color: #393939;">Contact our Med-executives for quick
                                        assistance.<br>
                      <span style="color: #0080FF;">help@medimall.com</span>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_twTCHDXzp.png?updatedAt=1641350923669" class="logo" style="margin:30px 0;width: 115px;">
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr class="header">
              <td align="center" valign="top">
                <img
                  src="https://cybazedemo.co.in/medimall/emil/made.png"
                  class="logo"
                  style="margin:30px 0;    width: 45%;"
                />
              </td>
            </tr>
          </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

`;

const generateOrderPlacedEmailTemplate = ({
  username,
  deliveryDate,
  paidAmount,
  savedAmount,
  paymentType,
  deliveryAddress,
  orderId,
  products,
  total,
  freeDelivery,
  deliveryCharge,
  medCoin,
  memberDiscount,
  couponDiscount,
  paidOnline,
  totalPayable,
  orderObjectId,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="img/favi.png" type="image/x-icon" />
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon" />
    <title>Medimall | Webmail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet" />
    <link href="css/font-awesome.min.css" rel="stylesheet" />
    <style>
      span.rs::before {
        top: 7px;
        width: 26px;
        height: 1px;
        background-color: #949494;
        transform: rotate(20deg);
        content: '';
        float: right;
        right: 0;
      }
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
      /* // Extra small devices (portrait phones, less than 576px) */
      @media (max-width: 575.98px) {
        hr.hert {
          left: 267px;
        }
      }
      /* // Small devices (landscape phones, 576px and up) */
      @media (min-width: 576px) and (max-width: 767.98px) {
      }
      /* // Medium devices (tablets, 768px and up) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        hr.hert {
          left: 250px;
        }
      }
      /* // Large devices (desktops, 992px and up) */
      @media (min-width: 992px) and (max-width: 1199.98px) {
      }
      /* // Extra large devices (large desktops, 1200px and up) */
      @media (min-width: 1024px) and (max-width: 1130px) {
        hr.hert {
          left: 371px;
        }
      }
      @media (min-width: 1400px) and (max-width: 1920px) {
      }
    </style>
  </head>
  <body style="text-align:center;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;">
    <div class="wrapper" style="width: 100%; table-layout: fixed; padding-bottom: 20px;">
      <div class="webkit" style="max-width: 600px;background: transparent linear-gradient(180deg , #FFFFFF 0%, #FCFEFF 83%, #ECFAFF 100%);"></div>
    </div>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto; width: 100%;max-width:600px;background: transparent linear-gradient(
      181deg
      ,#ffffff 90%,#ecfaff 100%);">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/conform_D6A4rMxht.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642596238258" class="stman" style="margin:20px 0 0 0; width:600px"/>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;">
              <thead>
                <tr>
                  <h1 style="text-align:center;margin-top: 0;   text-align: center;font-size: 30px;color: #393939;">
                    <span style="opacity: 0.7;font-weight: 600;margin-bottom:30px;">Hello</span>
                    ${username}
                  </h1>
                </tr>
              </thead>
              <tr>
                <td>
                  <div
                    class="section2"
                    style="height:auto;width:92%;background:transparent linear-gradient(119deg, #24974A 0%, #02852E 100%) 0% 0% no-repeat padding-box;border-radius:8px;opacity:1;padding:15px;"
                  >
                    <div class="greyconformation" style="width: 105px; float: left;">
                      <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/tick_IYpp3PQk0_c.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642646287647" style="margin:0px 15px 0px 15px;width: 80px;" />
                    </div>
                    <div class="handl" style="position:relative;text-align:left;margin:0px 0 0 100px;">
                      <h2 style="font-size:20px;color: #fff; opacity: 1; margin-bottom: 0;">
                        <span style="font-weight: 400;">Your</span> Order is Confirmed
                      </h2>
                      <label style="color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 15px;">Health is on its way!!!</label>
                    </div>
                    <p style="color:#393939;padding:0 58px;text-align:justify;color:#CEFCDE;opacity:1;padding-top: 15px;margin-bottom: 0;">
                      We are so happy to let you know your healthy order has
                    </p>
                    <p style="color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">successfully been placed.</p>
                    <p style="color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">Can’t wait to get your hands on health?</p>
                    <p style="color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">We know!</p>
                    <p style="color:#393939;padding:5px 58px;text-align:justify;color:#CEFCDE;opacity:1;margin: 0;">
                      Your health is on the way. We will let you know once it is shipped.
                    </p>
                    <div class="btngreensection" style="text-align:left;padding:30px 58px 25px 58px;">
                      <a
                        type="button"
                        class="green"
                        href="${
                          process.env.CLIENT_URL
                        }/dashboard-order-details/order-details/${orderObjectId}"
                        style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;background:#fff;text-decoration:none;border:1px;color:#148E3D;opacity:1;padding:11px 30px;box-shadow:1px 2px 9px #0000001c;border-radius:4px;font-size:15px;font-weight:500;"
                      >
                        View Order Details
                      </a>
                      <label style="float:right;color:#031E0C;opacity:0.5;margin:0px 0 0 0;line-height: 3;">- Team Medimall -</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table
              class="main-bg-light text-center"
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="text-align:center;"
            >
              <tr>
                <td>
                  <div class="expect" style="text-align:center;margin-bottom:25px;margin-top: 25px;">
                    
                      <img
                        src="https://medimall.co.in/webmailnew/img/index1icon.png"
                        class="exotimg"
                        style="object-fit: contain;background:#0BBF9D;padding:5px;border-radius:100%;height:16px;margin:0px 8px -6px 0px;width:16px;"
                      />
                      <p style="float: right;color:#ACACAC;opacity:1;"></p>Expected Delivery <span style="font-weight: 500;color:#0BBF9D;opacity:1;margin:0 0 0 9px;">${deliveryDate}</span>
                    </p>
                  </div>
                  <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:5px auto;" />
                </td>
              </tr>
            </table>
            <table
              class="main-bg-light text-center"
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="text-align:center;"
            >
              <tr>
                <div class="thankyou" style="margin:30px 0px 40px 0px;">
                  <h1 style="margin:0;font-size:40px;color:#06BDD2;opacity:1;    text-align: center;">Thank you</h1>
                  <p style="color:#BEBEBE;opacity:1;margin-top:0;font-size: 16px;    text-align: center;">for shopping with Medimall.</p>
                </div>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td
                  style="padding-left: 38px;background: #F2F2F2;width: 35%; padding: 0px 9px 0px 50px;border-top-left-radius: 6px; border-bottom-left-radius: 6px;"
                >
                  <div class="payment" style="float:left;width:100%;text-align:left;">
                    <p style="margin-bottom: 0px;color:#aaa9a9;font-size:10px;font-weight: 400;">Payment Summery</p>
                    <h3 style="margin:3px 0px;color:#494949;font-size: 24px;"> ₹${paidAmount}</h3>
                    <p style="margin-top: 0px;color:#aaa9a9;font-size:10px;font-weight: 400;">
                      You Saved<span style="color:#0C90A8;opacity:0.7;font-weight: 500;"> ₹${savedAmount}</span>
                    </p>
                  </div>
                </td>
                <td style="width: 65%;background: #F2F2F2;padding: 20px;border-top-right-radius: 6px; border-bottom-right-radius: 6px;">
                  <div class="paymentimg" style="border-left:1px solid #D1D1D1;float:left;width:100%;text-align:left;margin:0px;padding-left: 38px;">
                    <p style="color:#aaa9a9;font-size:9px;font-weight: 400;">Payment Mode</p>
                    <div class="imgpay">
                      <img src="https://medimall.co.in/webmailnew/img/cash.png" style="margin:0 7px 0 0;width:44px;float: left;" />
                      <label style="color:#0BBF9D;opacity:1;top:-8px;position:relative;left:13px;line-height: 3;font-weight: 600;"
                        >${
                          paymentType === "cod"
                            ? "Pay on Delivery"
                            : "Online payment"
                        }</label
                      >
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <!-- <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr class="header">
              <td align="center" valign="top">
                <div class="box1" style="border-radius:6px;opacity:0.69;background:#F2F2F2;height:110px;margin:0 15px;">
                  <div class="box2" style="padding:15px 60px;">
                    
                    
                  </div>
                </div>
              </td>
              <td>
                  
              </td>
            </tr>
          </table> -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="Delivery-at"
                    style="background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/addrs_PmVZ-HY_4.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642596236964);background-position: center;background-repeat:no-repeat;background-size:cover;text-align:left;margin:20px 0 0 0px;"
                  >
                    <div class="delivery" style="padding:27px 49px 27px 75px;">
                      <h4 style="margin-bottom: 8px;">Delivery at</h4>
                      <p style="color:#272727;opacity:0.7;margin:0px 0 14px 0;font-size: 14px;line-height: 1.5;
                      width: 90%; height: 45px;">${deliveryAddress}<br /></p>
                    </div>
                  </div>
                  <hr class="linetab" style="border:0.5px solid #f4f3f3;width:80%;margin:32px auto;margin-bottom: 36px;" />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header" >
                <td align="center" valign="top">
                  <div
                    class="packeage-details"
                    style="float: left;background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;margin:10px 0 0 0;"
                  >
                    <div class="pack1" style="padding:9px 9px;">
                      <div class="packhp" style="float:left;text-align:left;">
                        <h4 style="margin:0;color:#202020;opacity:1;font-size: 15px;
                        margin-bottom: 0px;">Package Details</h4>
                        <p style="color:#393939;font-size: 13px;padding:0;color: #373737;opacity: 0.7;margin: 2px 0 0 0;">
                          Healthy Order ID: #${orderId}
                        </p>
                      </div>
                      <a
                        href="${
                          process.env.CLIENT_URL
                        }/dashboard-order-details/order-details/${orderObjectId}"
                        class="cart_sub_btn_row_btn"
                        style="text-decoration:none;width:auto;float:right;height:auto;padding:10px 30px;background:#00AAFF 0% 0% no-repeat padding-box;box-shadow:3px 3px 9px #00000029;border-radius:5px;font-size:13px;color:#fff;"
                      >
                        Track your Order
                      </a>
                    </div>
                    <div class="pickup2" style="text-align:left;padding:55px 0px;">
                      ${products
                        .map(
                          (product) => `
                     <div class="cart_item_lst_row" style="width:92%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                      <div class="cart_item_lst_row_img" style="width:23%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                        <img src="${product.image}" alt="" style="width: 100%;height: 100px;
                        object-fit: contain;">
                      </div>
                      <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:14px;">Qty ${product.quantity}</div>
                      <div class="cart_item_lst_row_contant" style="width:70%;float:left;height:auto;margin-top:15px;margin-left: 10px;margin-top: 8px;">
                        <div class="cart_item_lst_row_contant_name" >
                          <h3 style="margin:0;">${product.name}</h3>
                        </div>
                        <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">
                          ${product.description}<br>
                      
                                              </div>
                        <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                          <div class="cart_item_lst_row_contant_rate crosswith11" style="width:100%;">
                            <span class="rs" style="text-decoration:line-through; width:100%;float:left;height:auto;color:#999997;position:relative;font-size:11px;margin-top:10px;">
                              ₹ ${product.realPrice}
                                                      </span><br>
                            <span style="font-weight: 600;font-size: 16px;">
                              ₹ ${product.amount}
                                                      </span>
                          </div>
                        </div>
                      </div>
                    </div>
                   
                   `
                        )
                        .toString()
                        .replace(/,/g, "")}
                    </div>
                    <div class="">
                      <div class="pick3" style="text-align:left;padding:0px 0 0px 0;width: 50%; float: left;">
                        <div
                          class="nextp"
                          style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/arrow_68C3KE-LAUt.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642596236967);object-fit: contain; background-size:contain;margin:0 0 3px 0px;height:120px;background-repeat:no-repeat;"
                        >
                          <div class="n1" style="padding:18px 8px 0 65px;">
                            <h4 style="margin:15px 0 4px 0px;">Next up!</h4>
                            <p style="color:#393939;color:#272727;opacity:0.7;font-size:9px;margin:0;">
                              We will let you know once your <br />
                              healthy order is all set to hit the road.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="pick3" style="text-align:left;padding:0px 0 0px 0;width: 50%; float: left;">
                        <div class="p2cnt" style="float:right;">
                          <img src="https://medimall.co.in/webmailnew/img/surprise.png" style="width: 100%;" />
                        </div>
                      </div></div>
                    <!-- <tr style="background: #f2f2f2;">
                      <td>
                         
                      </td>
                      <td></td>
                    </tr> -->
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div class="paymentsummery" style="text-align:left;padding:15px;">
                    <h4 style="color:#202020;opacity:1;font-size: 15px;">Payment Summary</h4>
                    <div class="paymain" style="width:600px;border:1px solid #E5E5E5;border-radius:9px;opacity:1;padding:10px;">
                      <div class="sub-total">
                        <h5 class="sub1" style="color:#1E1E1E;font-size:15px;float: left;
                        margin: 0px 10px;">
                          <img
                            src="https://ik.imagekit.io/zvtffbqbtdh/medimall/order_shipped/sub_0aU1Y1ApBx-_.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642660749226"
                            class="greentick"
                            style="width:65%; float: left;margin:0px 7px 0px 0px;"
                          />
                        </h5>
                        <h5
                          class="greenfont"
                          style="padding-right: 16px;line-height:1.5;margin: 9px 9px 12px 9px;color:#1E1E1E;text-align:right;opacity:1;color:#42804E;font-size:19px;"
                        >
                        ₹ ${total}
                        </h5>
                        <div class="listing-review" style="width:600px;background:#EEEEEE;border-radius:5px;padding:15px 0;margin:10px;">
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            ${
                              !freeDelivery
                                ? ` <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                              Delivery Charge
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹  ${deliveryCharge}
                              </li>
                            </ul>`
                                : ""
                            }
                          </div>
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                MedCoin
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹  ${medCoin}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            ${
                              memberDiscount
                                ? `<ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                              Medpride Discount (Optional)
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹ 252
                              </li>
                            </ul>`
                                : ""
                            }
                          </div>
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            ${
                              memberDiscount
                                ? `<ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                              Medpride Discount (Optional)
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹ 252
                              </li>
                            </ul>`
                                : ""
                            }
                          </div>
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                              Coupon Discount
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹ ${couponDiscount}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;background: #dbdbdb;
                            padding: 5px 10px; border-radius: 5px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                              Paid Online
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                              ₹ ${paidOnline}
                              </li>
                            </ul>
                          </div>
                          
                          <hr style="border: 1px solid #E5E5E5;margin: 15px 0;" />
                          <div class="f-review r-one" style="padding:1px 20px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                              Total Payable
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                              ₹ ${totalPayable}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;margin-bottom: 23px;" />
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="needhelp"
                    style="background-image:url(https://medimall.co.in/webmailnew/img/quickhelp.png);background-position: center;height:99px;margin:0 0px;background-repeat:no-repeat;padding:27px 62px;text-align:left;background-size:cover;"
                  >
                    <h4 style="margin-bottom: 0px;margin-top: 16px;margin-bottom: 8px; font-size: 15px;">Need quick help?</h4>
                    <p style="margin-top: 2px;color:#393939;font-size:12px;font-weight: 600;line-height: 1.5;">
                      Contact our Med-executives for quick assistance.<br />
                      <a style="color: #0080FF;text-decoration: none;" href="mailto:help@medimall.com">help@medimall.com</a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_j0_h1cu5BBi.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642128336737" class="logo" style="margin:20px 0;    width: 115px;" />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                <img
                src="https://ik.imagekit.io/zvtffbqbtdh/medimall/made__1__xV4mFY2tb.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642823424733"
                class="logo"
                style="margin:20px 0;    width: 45%;"
              />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const generateOrderShippedEMailTemplate = ({
  username,
  shippedDate,
  deliveryDate,
  paidAmount,
  savedAmount,
  paymentType,
  deliveryAddress,
  orderId,
  products,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="img/favi.png" type="image/x-icon" />
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon" />
    <title>Medimall | Webmail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet" />
    <link href="css/font-awesome.min.css" rel="stylesheet" />
    <style>
      span.rs::before {
        top: 7px;
        width: 26px;
        height: 1px;
        background-color: #949494;
        transform: rotate(20deg);
        content: '';
        float: right;
        right: 0;
      }
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
      /* // Extra small devices (portrait phones, less than 576px) */
      @media (max-width: 575.98px) {
        hr.hert {
          left: 267px;
        }
      }
      /* // Small devices (landscape phones, 576px and up) */
      @media (min-width: 576px) and (max-width: 767.98px) {
      }
      /* // Medium devices (tablets, 768px and up) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        hr.hert {
          left: 250px;
        }
      }
      /* // Large devices (desktops, 992px and up) */
      @media (min-width: 992px) and (max-width: 1199.98px) {
      }
      /* // Extra large devices (large desktops, 1200px and up) */
      @media (min-width: 1024px) and (max-width: 1130px) {
        hr.hert {
          left: 371px;
        }
      }
      @media (min-width: 1400px) and (max-width: 1920px) {
      }
    </style>
  </head>
  <body style="text-align:center;font-family:'Poppins', sans-serif;margin: 20px auto;">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="margin:0 auto; width: 100%;max-width:600px;background: transparent linear-gradient(180deg , #FFFFFF 0%, #FCFEFF 83%, #ECFAFF 100%);"
    >
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/shipped_mBqAWJ8HgBV.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642846738950"
                    class="stman"
                    style="margin:20px 0 0 0;width:600px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:30px;">
              <thead>
                <tr>
                  <h1 style="margin-top:0; font-size: 30px;color: #1E1E1E; text-align: center;">
                    <span style="opacity: 0.5;font-weight: 600;margin-bottom:30px;">Hello</span>
                    ${username}
                  </h1>
                </tr>
              </thead>
              <tr>
                <td>
                  <div
                    class="section2"
                    style="width:94%;height:auto;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/index-4section_N74sZoMGwBz.png?updatedAt=1641350916676);border-radius:8px;opacity:1;padding:15px;background-repeat:no-repeat;background-size:830px 471px;"
                  >
                    <div class="greyconformation" style="width: 115px; float: left;">
                      <img
                        src="https://ik.imagekit.io/zvtffbqbtdh/medimall/blue-r_TTmPQ2R7C.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642846735075"
                        style="margin:5px 15px 0px 15px;width: 70%;"
                      />
                    </div>
                    <div class="handl" style="position:relative;text-align:left;margin:0px 0 0 100px;">
                      <h2 style="color: #fff; opacity: 1; margin-bottom: 0;font-size: 22px;">
                        <span style="font-weight: 400;">Your</span> Order Shipped<span
                          class="date"
                          style="color:#9ac1f6;font-size:13px;margin:0 9px;font-weight:100;"
                          >On ${shippedDate}</span
                        >
                      </h2>
                      <label style="font-weight: 300;color: #bbdffd; margin: 0 0 0 3px;font-size: 15px;">Health is on its way!!!</label>
                    </div>
                    <p style="font-weight: 200;text-align:left;color:#adcffc;padding:18px 58px;line-height:25px;font-size: 14px;">
                      Hey there,<br />
                      Your health capsule has hit the road on its way to serve you. We<br />
                      know that you can’t wait to get your hands on them. Don't Worry,<br />
                      our team is working hard to ensure a high safety standard in the<br />
                      middle of this devastating time. Meanwhile, you can check out<br />
                      My Order to get further updates on your order.
                    </p>
                    <div class="tema" style="text-align:right;color:#FFFFFF;opacity:0.7;margin:0 0 10px 0;">
                      <label>- Team Medimall -</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px;">
              <tbody>
                <tr align="left" class="">
                  <td>
                    <div class="expect" style="text-align:center;text-align:left;">
                      <p style="color:#ACACAC;opacity:1;padding:0 0 15px 15px;">
                        <img
                          src="https://ik.imagekit.io/zvtffbqbtdh/medimall/delby_d6PSg4CEc.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642846735216"
                          class="exotimg"
                          style="margin:0px;width: 22%; float: left;"
                        /> <span style="color:#0BBF9D;opacity:1;margin:0 0 0 9px;font-weight: 500;    font-size: 14px;">${deliveryDate}</span>
                        <label class="logistic" style="text-align:right;float:right;padding:0 65px 0 0;    font-size: 14px;">Logistic Partner : Medimall</label>
                      </p>
                    </div>
                    
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td
                  style="padding-left: 38px;background: #F2F2F2;width: 35%; padding: 0px 10px 0px 35px;border-top-left-radius: 6px; border-bottom-left-radius: 6px;"
                >
                  <div class="payment" style="float:left;width:100%;text-align:left;border-right:1px solid #D1D1D1;">
                    <p style="margin-bottom: 0px;color:#aaa9a9;font-size:10px;font-weight: 400;">Total Payable</p>
                    <h3 style="margin:3px 0px;color:#494949;font-size: 24px;"> ₹${paidAmount}</h3>
                    <p style="margin-top: 0px;color:#aaa9a9;font-size:10px;font-weight: 400;">
                      You Saved<span style="color:#0C90A8;font-size:10px;font-weight: 500;"> ₹${savedAmount}</span>
                    </p>
                  </div>
                </td>
                <td style="width: 65%;  background: #F2F2F2;padding: 20px;border-top-right-radius: 6px; border-bottom-right-radius: 6px;">
                  <div class="paymentimg" style="float:left;width:100%;text-align:left;margin:0 0 0 20px;">
                    <p style="color:#aaa9a9;font-size:9px;font-weight: 400;">Payment Mode</p>
                    <div class="imgpay">
                      <img
                        src="https://ik.imagekit.io/zvtffbqbtdh/medimall/cash_lpkEMOX2k.png?updatedAt=1640686991098"
                        style="margin:0 7px 0 0;width:42px;    float: left;"
                      />
                      <label style="color:#0BBF9D;opacity:1;line-height: 3;font-weight: 500;">${
                        paymentType === "cod"
                          ? "Pay on Delivery"
                          : "Online payment"
                      }</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
              <td align="center" valign="top">
              <div class="Delivery-at" style="background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/order_shipped/addrs_e_x88IoGSGQ.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642660748091);background-position: center;background-repeat:no-repeat;background-size:cover;text-align:left;margin-top: 30px;
              margin-bottom: 30px;">
                <div class="delivery" style="padding:19px 67px 43px 74px;">
                  <h4 style="margin-bottom: 8px;">Delivery to</h4>
                  <p style="color:#272727;opacity:0.7;margin:0px 0 1px 0;font-size: 14px;
                  height: 45px;">${deliveryAddress}<br>
                  </p>
                </div>
              </div>
              <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:40px auto;margin-bottom: 40px;">
            </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="packeage-details"
                    style="float:left;background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;    padding-bottom: 0px;margin:10px 0 0 0;"
                  >
                    <div class="pack1" style="padding:9px;">
                      <div class="packhp" style="float:left;text-align:left;">
                        <h4 style="margin:0;color:#202020;opacity:1;font-size: 15px;">Package Details</h4>
                        <p style="color:#393939;font-size: 12px;padding:0;color: #373737;opacity: 0.7;margin: 3px 0 0 0;">
                          Healthy Order ID: #${orderId}
                        </p>
                      </div>
                      <a
                      href="google.com"
                        class="cart_sub_btn_row_btn"
                        style="text-decoration:none; width:auto;float:right;height:auto;padding:10px 30px;background:#00AAFF 0% 0% no-repeat padding-box;box-shadow:3px 3px 9px #00000029;border-radius:5px;font-size:13px;color:#fff;"
                      >
                        Track your Order
                      </a>
                    </div>
                    <div class="pickup2" style="text-align:left;padding:52px 0px;">
                      ${products
                        .map(
                          (product) => `
                      <div class="cart_item_lst_row" style="width:92%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                        <div class="cart_item_lst_row_img" style="width:23%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                          <img src="${product.image}" alt="" style="width: 100%;height: 100px;
                          object-fit: contain;">
                        </div>
                        <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:14px;">Qty 1</div>
                        <div class="cart_item_lst_row_contant" style="width:70%;float:left;height:auto;margin-top:15px;margin-left: 10px;margin-top: 8px;">
                          <div class="cart_item_lst_row_contant_name" >
                            <h3 style="margin:0;">Himalaya Face Wash</h3>
                          </div>
                          <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">
                            Men Blue & White Regular<br>
                            Fit Checked Ca...
                                                </div>
                          <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                            <div class="cart_item_lst_row_contant_rate crosswith11" style="width:101%;">
                              <span class="rs" style="text-decoration:line-through; width:100%;float:left;height:auto;color:#050500;opacity:0.5;position:relative;font-size:11px;margin-top:10px;">
                                 ₹${product.realPrice}
                                                        </span><br>
                              <span style="font-weight: 600;">
                                 ₹${product.amount}
                                                        </span>
                            </div>
                          </div>
                        </div>
                      </div>`
                        )
                        .toString()
                        .replace(/,/g, "")}
                    </div>

                   <div>
                        <div class="pick3" style="text-align:left;padding:0px 0 0px 0;width: 50%; float: left;">
                          <div
                            class="nextp"
                            style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/order_shipped/arrow_vUTHofZS2eD.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642660749001);background-size:contain;margin:0 0 3px 0px;height:120px;background-repeat:no-repeat;"
                          >
                            <div class="n1" style="padding: 10px 42px 0 58px;">
                              <h4 style="margin:15px 0 4px 0px;">Next up!</h4>
                              <p style="color:#393939;color:#272727;opacity:0.7;font-size:9px;margin:0;">
                              We will let you know once your <br>healthy order is all set to reach your hands.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="pick3" style="text-align:left;padding:0px 0 0px 0;width: 50%; float: left;">
                          <div class="p2cnt" style="float:right;">
                            <img
                              src="https://ik.imagekit.io/zvtffbqbtdh/medimall/surprise_3KShWmj-tWg.png?updatedAt=1640687117822"
                              style="width: 100%;"
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                </td>
                
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
              <td>
              <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:55px auto;margin-bottom: 30px;">
             
              </td></tr>
              </table>

            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="needhelp"
                    style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/quickhelp_1JALHC1DH.png?updatedAt=1640687116741);height:110px;margin:0 0px;background-repeat:no-repeat;padding:27px 58px;text-align:left;background-size:cover;"
                  >
                    <h4 style="margin-bottom: 0px;margin-top: 20px;font-size: 18px;">Need quick help?</h4>
                    <p style="margin-top: 2px;color:#393939;font-size:13px;font-weight: 600;color: #393939;line-height:1.5;">
                      Contact our Med-executives for quick assistance.<br />
                      <a style="color: #0080FF;font-size:12px;text-decoration:none;">help@medimal5l.com</a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_j0_h1cu5BBi.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642128336737"
                    class="logo"
                    style="margin:20px 0; width:115px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://cybazedemo.co.in/medimall/emil/made.png"
                    class="logo"
                    style="margin:30px 0;    width: 45%;"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const generateRefundIssuedEMailTemplate = ({
  username,
  returnId,
  products,
  refundAmount,
  cartValue,
  amountPaid,
  medCoinUsed,
  totalRefundable,
  total,
  orderObjectId,
  returnRequestDate,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="img/favi.png" type="image/x-icon" />
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon" />
    <title>Medimall | Webmail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet" />
    <link href="css/font-awesome.min.css" rel="stylesheet" />
    <style>
      span.rs::before {
        top: 7px;
        width: 26px;
        height: 1px;
        background-color: #949494;
        transform: rotate(20deg);
        content: '';
        float: right;
        right: 0;
      }
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
      /* // Extra small devices (portrait phones, less than 576px) */
      @media (max-width: 575.98px) {
        hr.hert {
          left: 267px;
        }
      }
      /* // Small devices (landscape phones, 576px and up) */
      @media (min-width: 576px) and (max-width: 767.98px) {
      }
      /* // Medium devices (tablets, 768px and up) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        hr.hert {
          left: 250px;
        }
      }
      /* // Large devices (desktops, 992px and up) */
      @media (min-width: 992px) and (max-width: 1199.98px) {
      }
      /* // Extra large devices (large desktops, 1200px and up) */
      @media (min-width: 1024px) and (max-width: 1130px) {
        hr.hert {
          left: 371px;
        }
      }
      @media (min-width: 1400px) and (max-width: 1920px) {
      }
    </style>
  </head>
  <body
    style="text-align:center;font-family:'Poppins', sans-serif;"
  >
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px;background: transparent linear-gradient(
      181deg
      ,#ffffff 90%,#ecfaff 100%);">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/index-7_ZyBPdIDBu.png?updatedAt=1641350919711"
                    class="stman"
                    style="margin:20px 0 0 0;width: 600px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <h1 style="margin:0;font-size:30px;color: #1E1E1E;margin-bottom:30px; text-align: center;">
                    <span style="opacity: 0.5;font-weight: 600;">Hello</span>
                    ${username}
                  </h1>
                </tr>
              </thead>
              <tr>
                <td>
                  <div
                    class="section2"
                    style="height:auto;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/index-4section_hYYf5FJg_.png?updatedAt=1641346390663);border-radius:8px;opacity:1;padding:15px;background-repeat:no-repeat;background-size:830px 471px;margin:0 0 0px 0;"
                  >
                    <div class="greyconformation" style="width: 115px; float: left;">
                      <img
                        src="https://ik.imagekit.io/zvtffbqbtdh/medimall/greyconformation_bHbvvV2v2rbI.png?updatedAt=1640686991317"
                        style="margin:5px 15px 0px 15px; width: 70%;"
                      />
                    </div>
                    <div class="handl" style="position:relative;text-align:left;margin:0px 0 0 100px;">
                      <h2 style="color: #fff; opacity: 1; margin-bottom: 0;font-size: 20px;">
                        Refund
                        <span style="font-weight: 400;">issued</span>
                      </h2>
                      <label style="color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 14px;">On ${returnRequestDate}</label>
                    </div>
                    <p style="color:#393939;text-align:left;color:#FFFFFF;font-size: 14px;padding:15px 58px;line-height:25px;">
                      We have successfully completed your return process and <br />
                      initiated your refund under the reference Id MDFL89555550. The amount will be<br />
                      credited to your wallet within the next 5 business days. Keep <br />
                      shopping with us.
                    </p>
                    <div class="tema" style="text-align:right;color:#FFFFFF;opacity:0.7;margin:0 0 10px 0;">
                      <label>- Team Medimall -</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;" />
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header" style="background:#F2F2F2">
                <td align="center" valign="top">
                  <div
                    class="packeage-details"
                    style="background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;margin:10px 0 0 0;"
                  >
                    <div class="pack1" style="padding:9px;">
                      <div class="packhp" style="float:left;text-align:left;">
                        <h4 style="margin:0;color:#202020;opacity:1;font-size: 15px;">Return Details</h4>
                        <p style="color:#373737;opacity:0.7;font-size:12px;margin: 3px 0 0 0;">Return ID : #${returnId}</p>
                      </div>
                      <a
                      href="${
                        process.env.CLIENT_URL
                      }/dashboard-order-details/order-details/${orderObjectId}"
                        class="cart_sub_btn_row_btn"
                        style="text-decoration:none;width:auto;float:right;height:auto;padding:8px 30px;background:#00AAFF 0% 0% no-repeat padding-box;box-shadow:3px 3px 9px #00000029;border-radius:5px;font-size:13px;color:#fff;"
                      >
                        Track your Order
                      </a>
                    </div>
                    <div class="pickup2" style="text-align:left;">
                      ${products
                        .map(
                          (product) => `
                  <div class="cart_item_lst_row" style="margin-top: 20px; width:92%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                      <div class="cart_item_lst_row_img" style="width:25%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                        <img src="${product.image}" alt="" style="width: 100%;"/>
                                      </div>
                      <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:13px;">Qty ${product.quantity}</div>
                      <div class="cart_item_lst_row_contant" style="width:63%;float:left;height:auto;margin-top:15px;margin-left: 10px;margin-top: 15px;">
                        <div class="cart_item_lst_row_contant_name" >
                          <h3 style="margin:0;">${product.name}</h3>
                        </div>
                        <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">${product.description}</div>
                        <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                          <div class="cart_item_lst_row_contant_rate crosswith11" style="width:101%;">
                            <span class="rs" style="text-decoration:line-through;width:100%;float:left;height:auto;color:#050500;opacity:0.5;position:relative;font-size:11px;margin-top:10px;">  ₹ ${product.realPrice} </span><br/>
                                            <span>  ₹ ${product.amount} </span>
                          </div>
                        </div>
                      </div>
                    </div>`
                        )
                        .toString()
                        .replace(/,/g, "")}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top"></td>
                <td align="center" valign="top">
                  <div class="paymentsummery" style="text-align:left;padding:15px;">
                    <h4 style="color:#202020;opacity:1;margin-top:0; font-size: 15px;">Payments Breakup</h4>
                    <div class="paymain" style="border:1px solid #E5E5E5;border-radius:9px;opacity:1;padding:10px;">
                      <div class="sub-total">
                        <div style="    float: left;">
                          <h5 class="sub1" style="margin:10px;color:#1E1E1E;font-size:15px;margin-top: 0px;">
                            <img
                              src="https://ik.imagekit.io/zvtffbqbtdh/medimall/cart-value_Kb2Rv3iIPhC.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642772418091"
                              class="greentick"
                              style="width: 65%;margin:0px 7px 0px 0px; "
                            />
                          </h5>
                        </div>

                        <h5
                          class="greenfont"
                          style="margin:10px;color:#1E1E1E;text-align:right;opacity:1;color:#42804E;margin:6px 45px 23px 0;font-size:15px;"
                        >
                          ₹ ${cartValue}
                        </h5>
                        <div class="listing-review" style="background:#EEEEEE;border-radius:5px;padding:15px 0;margin:10px;">
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                Amount Paid
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                ₹  ${amountPaid}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                MedCoins Used
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                ₹  ${medCoinUsed}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                Total Refundable
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                ₹  ${totalRefundable}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                * The Med Coins you have earned on this order have been revoked.
                              </li>
                            </ul>
                          </div>
                          <hr style="border: 1px solid #E5E5E5;margin: 15px 0;" />
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                                Total
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                                ₹ ${total}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="needhelp"
                    style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/quickhelp_1JALHC1DH.png?updatedAt=1640687116741);background-position: center;height:112px;background-repeat:no-repeat;padding:27px 50px;text-align:left;background-size:cover"
                  >
                    <h4 style="margin-bottom: 5px;margin-top: 25px;">Need quick help?</h4>
                    <p style="margin-top: 2px;color:#393939;font-size:13px;font-weight: 600;color: #393939;">
                      Contact our Med-executives for quick assistance.<br />
                      <span style="color: #0080FF;">help@medimall.com</span>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_twTCHDXzp.png?updatedAt=1641350923669"
                    class="logo"
                    style="margin:30px 0;width: 100px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/made_3oY1rF-7LO5.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642128405898"
                    class="logo"
                    style="margin:20px 0;"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const generateOrderReturnRequestEMailTemplate = ({
  username,
  pickupDate,
  deliveryAddress,
  refundAmount,
  returnId,
  products,
  amountPaid,
  medCoinUsed,
  totalRefundable,
  paymentType,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="img/favi.png" type="image/x-icon" />
    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon" />
    <title>Medimall | Webmail</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet" />
    <link href="css/font-awesome.min.css" rel="stylesheet" />
    <style>
      span.rs::before {
        top: 7px;
        width: 26px;
        height: 1px;
        background-color: #949494;
        transform: rotate(20deg);
        content: '';
        float: right;
        right: 0;
      }
    </style>
    <style type="text/css">
      /*----------------------media-----------------       */
      /* // Extra small devices (portrait phones, less than 576px) */
      @media (max-width: 575.98px) {
        hr.hert {
          left: 267px;
        }
      }
      /* // Small devices (landscape phones, 576px and up) */
      @media (min-width: 576px) and (max-width: 767.98px) {
      }
      /* // Medium devices (tablets, 768px and up) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        hr.hert {
          left: 250px;
        }
      }
      /* // Large devices (desktops, 992px and up) */
      @media (min-width: 992px) and (max-width: 1199.98px) {
      }
      /* // Extra large devices (large desktops, 1200px and up) */
      @media (min-width: 1024px) and (max-width: 1130px) {
        hr.hert {
          left: 371px;
        }
      }
      @media (min-width: 1400px) and (max-width: 1920px) {
      }
    </style>
  </head>
  <body
    style="text-align:center;font-family:'Poppins', sans-serif;"
  >
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px;background: transparent linear-gradient(
      181deg
      ,#ffffff 90%,#ecfaff 100%);">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/index6_1__YsFAYoZI4.png?updatedAt=1641350919330"
                    class="stman"
                    style="margin:20px 0 0 0;width: 600px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <h1 style="margin:0;font-size:30px;;color: #1E1E1E; text-align: center;margin-bottom:30px;">
                    <span style="opacity: 0.5;font-weight: 600;">Hello</span>
                    ${username}
                  </h1>
                </tr>
              </thead>
              <tr>
                <td>
                  <div
                    class="section2"
                    style="height:auto;background:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/index-4section_N74sZoMGwBz.png?updatedAt=1641350916676);border-radius:8px;opacity:1;padding:15px;background-repeat:no-repeat;background-size:830px 471px;"
                  >
                    <div class="greyconformation"  style="width: 115px; float: left;">
                      <img
                        src="https://ik.imagekit.io/zvtffbqbtdh/medimall/greyconformation_Vb-MSRvH4.png?updatedAt=1641350906584"
                        style="margin:5px 15px 0px 15px; width: 70%;;"
                      />
                    </div>
                    <div class="handl" style="position:relative;text-align:left;margin:0px 0 0 100px;">
                      <h2 style="color: #fff; opacity: 1; margin-bottom: 0;font-size: 20px;">
                        <span style="font-weight: 400;">Return</span> Request Confirmation
                      </h2>
                      <label style="color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 12px;">Your Medimall refund has been issued</label>
                    </div>
                    <p style="color:#393939;text-align:left;color:#FFFFFF;padding:23px 58px;line-height:25px;font-size:14px;">
                      Hey there, We got your healthy order return request. We are so sad that you didn’t enjoy our healthy package. We have
                      confirmed your return request. Our health partner will soon be over there to collect the package. We will initiate your refund
                      once the health package<br />
                      reaches us. Keep shopping with us.
                    </p>
                    <div class="tema" style="text-align:right;color:#FFFFFF;opacity:0.7;margin:0 0 10px 0;">
                      <label>- Team Medimall -</label>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:30px;">
              <tbody>
                <tr align="left" class="">
                  <td>
                  
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr class="header">
                  <td align="center" valign="top">
                    <div
                      class="Delivery-at"
                      style="background:url(https://cybazedemo.co.in/medimall/emil/addrs.png);background-repeat:no-repeat;background-size:contain;text-align:left;margin:20px 0 0 0px;"
                    >
                      <div class="delivery" style="padding:26px 87px 69px 81px;">
                        <h4 style="margin-bottom: 5px;">Pick Up Address</h4>
                        <p style="    font-size: 14px;color:#272727;opacity:0.7;margin:0px 0 0 0;">${deliveryAddress}</p>
                        <p></p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header" >
                <td align="center" valign="top">
                  <div
                    class="packeage-details"
                    style="float: left;background:#F2F2F2 0% 0% no-repeat padding-box;border-radius:7px;opacity:1;height:auto;padding:15px;margin:30px 0;"
                  >
                    <div class="pack1" style="padding:9px 0;">
                      <div class="packhp" style="float:left;text-align:left;">
                        <h4 style="margin:0;color:#202020;opacity:1;font-size:15px;">Product Details</h4>
                        <p style="color:#373737;opacity:0.7;font-size:12px;margin-top: 3px;">Return ID : #${returnId}</p>
                      </div>
                    </div>
                    <div class="pickup2" style="text-align:left;">
                      ${products
                        .map(
                          (product) => `

<div class="cart_item_lst_row" style="width:92%;float:left;height:auto;background:#FFFFFF 0% 0% no-repeat padding-box;box-shadow:4px 4px 12px #00000014;border-radius:12px;margin-bottom:15px;padding:20px;position:relative;">
                      <div class="cart_item_lst_row_img" style="width:25%;float:left;height:auto;margin-top:10px;background:#F1F1F1;padding:12px;border-radius:8px;top: 0;">
                        <img src="${product.image}" alt="" width="100%"/>
                                      </div>
                      <div class="qty" style="float:right;color:#373737;opacity:0.7;font-size:13px;">Qty ${product.quantity}</div>
                      <div class="cart_item_lst_row_contant" style="width:63%;float:left;height:auto;margin-top:15px;margin-left: 10px;margin-top: 15px;">
                        <div class="cart_item_lst_row_contant_name" style="">
                          <h3 style="margin:0;">${product.name}</h3>
                        </div>
                        <div class="cart_item_lst_row_contant_cmpny" style="color:#272727;opacity:0.7;margin:7px 0 0 0;">${product.description}</div>
                        <div class="cart_item_lst_row_contant_rate" style="width:101%;text-align: right;">
                          <div class="cart_item_lst_row_contant_rate crosswith11" style="width:101%;">
                            <span class="rs" style="text-decoration:line-through;width:100%;float:left;height:auto;color:#050500;opacity:0.5;position:relative;font-size:11px;margin-top:10px;">  ₹ ${product.amount} </span><br/>
                                            <span>  ₹ ${product.amount} </span>
                          </div>
                        </div>
                      </div>
                    </div>


                  `
                        )
                        .toString()
                        .replace(/,/g, "")}
                    </div>
                   <div>
                    <div class="pick3" style="text-align:left;padding:0px 0 0px 0;">
                      <div
                        class="refundmoode"
                        style="box-shadow:0px 3px 6px #00000008;border-radius:7px;opacity:1;background:#fff;padding:15px;    margin: 210px 0 0 0;"
                      >
                        <h5 style="margin:10px;color:#1E1E1E;margin-top:0;color:#202020;font-size:15px;">Refund Mode</h5>
                        <div class="cards" style="border:1px solid #70707030;border-radius:4px;padding:15px;">
                          <img
                            src="https://ik.imagekit.io/zvtffbqbtdh/medimall/bank_xdr-mizx-.png?updatedAt=1641350901413"
                            class="bank"
                            style="float: left;"
                          />
                          <p style="color:#393939;text-align:left;margin:6px 0px 0 65px;color:#373737;font-size:11px;font-weight:600;">
                           ${paymentType}
                            <span style="float:right;margin:-8px 0 0px 0;color:#202020;opacity:1;font-size:16px;font-weight:600;"
                              > ₹  ${refundAmount}</span
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                   </div>
                  </div>
                </td>
              </tr>
              
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;" />
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top"></td>
                <td align="center" valign="top">
                  <div class="paymentsummery" style="text-align:left;padding:15px;">
                    <div class="paymain" style="border:1px solid #E5E5E5;border-radius:9px;opacity:1;padding:10px;">
                      <div class="sub-total">
                        <ul style="padding-left: 0px;">
                          <li style="list-style: none;float: left;">
                            <h5 class="sub1" style="margin:10px;color:#1E1E1E;font-size:15px;margin-top: 0px;">
                              <img
                                src="https://ik.imagekit.io/zvtffbqbtdh/medimall/refund_w7lScHNyDar.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642772465790"
                                class="greentick"
                                style="width:70%;margin:0px 7px 0px 0px;"
                              />
                            </h5>
                          </li>
                          <li style="list-style: none;">
                            <h5 class="greenfont" style="margin:10px;color:#1E1E1E;text-align:right;opacity:1;color:#42804E;font-size:15px;">
                              ₹ ${totalRefundable}
                            </h5>
                          </li>
                        </ul>

                        <div class="listing-review" style="background:#EEEEEE;border-radius:5px;padding:15px 0;margin:10px;">
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                Amount Paid
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                 ₹  ${amountPaid}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                MedCoins Used
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                 ₹  ${medCoinUsed}
                              </li>
                            </ul>
                          </div>
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;"
                              >
                                Total Refundable
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #585858; opacity: 0.85;"
                              >
                                 ₹  ${totalRefundable}
                              </li>
                            </ul>
                          </div>
                          <hr style="border: 1px solid #E5E5E5;margin: 15px 0;" />
                          <div class="f-review r-one" style="padding:1px 40px 3px 20px;">
                            <ul style="margin:0;padding:0;margin-bottom:3px;">
                              <li
                                style="display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                                Total
                              </li>
                              <li
                                style="float: right;display:inline-block;text-decoration:unset;font-weight:300;font-size:14px;color:#202020;opacity:0.7;line-height:30px;color: #202020; opacity: 1;font-weight: 600;"
                              >
                                 ₹ 490
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div class="mainstp" style="margin:30px 15px 15px 15px;">
                    <div class="qdmain" style="background:#F2F2F2;border-radius:7px;opacity:1;text-align:left;padding:15px;">
                      <h4 style="margin: 0;">Quick Guide</h4>
                      <p class="margin" style="color:#393939;margin:10px 0 10px 0;color:#202020;opacity:0.7;">
                        Here is a quick guide on how to prepare your item for return.
                      </p>
                      <div class="gdbox1" style="background:#FFFFFF;border-radius:7px;opacity:1;padding:15px;">
                        <table style="width: 100%;">
                          <tr>
                            <td>
                              <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/step1_1LxbIwAAo6s.png?updatedAt=1641350933189" class="step1" />
                            </td>
                            <td>
                              <h4 style="margin:0;color:#202020;opacity:1;">Step1</h4>
                              <p class="stp" style="color:#393939;margin:0;color:#202020;opacity:0.7;">Place the item in an unsealed package.</p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/step2_k5GJ6HQlW.png?updatedAt=1641350933657" class="step1" />
                            </td>
                            <td>
                              <h4 style="margin:0;color:#202020;opacity:1;">Step2</h4>
                              <p class="stp" style="color:#393939;margin:0;color:#202020;opacity:0.7;">
                                Ensure that the item is not opened/unused and has all original tags intact/ <br />
                                original condition.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src="https://ik.imagekit.io/zvtffbqbtdh/medimall/step3_JuwSFpmRY.png?updatedAt=1641350933864" class="step1" />
                            </td>
                            <td>
                              <h4 style="margin:0;color:#202020;opacity:1;">Step3</h4>
                              <p class="stp" style="color:#393939;margin:0;color:#202020;opacity:0.7;">
                                Do keep the pickup receipt as proof of pickup.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <hr class="linetab" style="border:1px solid #e8e8e8;width:80%;margin:30px auto;" />
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <div
                    class="needhelp"
                    style="background-image:url(https://ik.imagekit.io/zvtffbqbtdh/medimall/quickhelp_1JALHC1DH.png?updatedAt=1640687116741);height:112px;background-position: center;background-repeat:no-repeat;padding:27px 50px;text-align:left;background-size:cover"
                  >
                    <h4 style="margin-bottom: 5px;margin-top: 25px;">Need quick help?</h4>
                    <p style="margin-top: 2px;color:#393939;font-size:13px;font-weight: 600;color: #393939;">
                      Contact our Med-executives for quick assistance.<br />
                      <span style="color: #0080FF;">help@medimall.com</span>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/logo_twTCHDXzp.png?updatedAt=1641350923669"
                    class="logo"
                    style="margin:30px 0;width: 100px;"
                  />
                </td>
              </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr class="header">
                <td align="center" valign="top">
                  <img
                    src="https://ik.imagekit.io/zvtffbqbtdh/medimall/made_3oY1rF-7LO5.png?ik-sdk-version=javascript-1.4.3&updatedAt=1642128405898"
                    class="logo"
                    style="margin:20px 0;"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

module.exports = {
  generateOrderCancelledEMailTemplate,
  generateOrderDeliveredEMailTemplate,
  generateOrderPlacedEmailTemplate,
  generateOrderShippedEMailTemplate,
  generateRefundIssuedEMailTemplate,
  generateOrderReturnRequestEMailTemplate,
};
