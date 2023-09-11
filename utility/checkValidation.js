const axios = require ('axios')
require("dotenv").config();
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTKEY;

const gstValidation = async (req, res, next) => {
  const gstNumber = req.body.gstNumber;
  const data = {
    GSTIN: gstNumber.trim(),
    businessName: "",
  };
  console.log(gstNumber);

  axios
    .post("https://api.cashfree.com/verification/gstin", data, {
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.message == "GSTIN Doesn't Exist")
        return res.json({ msg: false, data: response.data });

      res.json({ msg: true, data: response.data });
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ msg: false, error: error.message });
    });
};

const panValidation = async (req, res, next) => {
  // Add Cashfree API
  console.log(req.body.panNumber);

  const data = {
    pan: req.body.panNumber.trim(),
  };
  axios
    .post("https://api.cashfree.com/verification/pan", data, {
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      res.json({ msg: true, data: response.data });
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ msg: false, error: error.message });
    });
};

const uidValidation = async (req, res, next) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    },
    body: JSON.stringify({
      aadhaar_number: req.body.uidNumber.trim(),
    }),
  };
  const url = "https://api.cashfree.com/verification/offline-aadhaar/otp";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response
      res.json({ msg: true, data: data });
      console.log(data);
    })
    .catch((error) => {
      // Handle errors
      res.json({ msg: false, error: error.message });
      console.error(error);
    });
};

const otpValidation = async (req, res, next) => {
  console.log(req.body.ref_id);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    },
    body: JSON.stringify({
      otp: req.body.otp.trim(),
      ref_id: req.body.ref_id.trim(),
    }),
  };
  console.log(requestOptions);

  const url = "https://api.cashfree.com/verification/offline-aadhaar/verify";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response
      if (data.status == "VALID") {
        return res.json({ msg: true, data: data });
      } else {
        return res.json(data);
      }
      console.log(data.status);
    })
    .catch((error) => {
      // Handle errors
      res.json(error);
      console.error(error);
    });
};

const uidImage = async (req, res, next) => {
  console.log(req.files);
  const formData = new FormData();
  formData.append("front_image", req.files.uid_front[0].path);
  formData.append("back_image", req.files.uid_back[0].path);
  formData.append("verification_id", "Carbyne!@#");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    },
    body: formData,
  };

  const url = "https://api.cashfree.com/verification/document/aadhaar";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      // Handle errors
      res.json(error);
      console.error(error);
    });
};

const panImage = async (req, res, next) => {
  console.log(req.files);
  // const formData=new FormData();
  //formData.append('front_image',req.files.pan_front[0].path)
  // formData.append('verification_id',"Carbyne!@#")
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    },
    body: JSON.stringify({
      front_image: req.files.pan_front[0].path,
      verification_id: "Carbyne!@#",
    }),
  };
  console.log(requestOptions);
  const url = "https://api.cashfree.com/verification/document/pan";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response
      //      res.json(data)
      console.log(data);
    })
    .catch((error) => {
      // Handle errors
      res.json(error);
      //    console.error(error);
    });
};


const bankInfoValidation = async (req, res, next) => {
    console.log(req.body)
  const url2 = `https://payout-api.cashfree.com/payout/v1.2/validation/bankDetails?bankAccount=${req.body.bankAccNo}&ifsc=${req.body.bankIfscNo}`;
  console.log(url2);

  const url = "https://payout-api.cashfree.com/payout/v1/authorize";

  const headers = {
    accept: "application/json",
    "X-Client-Secret": clientSecret,
    "X-Client-Id": clientId,
  };
  console.log(headers)
  axios
    .post(url, null, { headers })
    .then((response) => {
      // Extract the access token from the response
        console.log(response)
      const accessToken = response.data.data.token;

      // Use the access token for subsequent requests to the Cashfree Payout API
      // Include it as a bearer token in the request headers
      // Example:
      const payoutRequestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        //   // ... Additional options for the Payout API request
      };
      console.log(url2);
      axios
        .get(url2, payoutRequestOptions)
        .then((response) => {
          console.log(response.data);
          res.json({ msg: true, data: response.data });
        })
        .catch((error) => {
          console.log(error.message);
          res.json({ msg: false, error: error.message });
        });
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
};


module.exports={gstValidation,panImage,panValidation, uidImage,uidValidation, bankInfoValidation, otpValidation}
