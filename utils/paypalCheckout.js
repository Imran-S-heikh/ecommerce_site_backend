const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT,process.env.PAYPAL_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

async function paypalCheckout(amount) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
          {
            "amount": {
              "currency_code": "USD",
              "value": amount
            }
          }
        ]
    });

    const response = await client.execute(request);

    console.log(response.result,'----------------------------')

    return response.result.id;
}

module.exports = paypalCheckout