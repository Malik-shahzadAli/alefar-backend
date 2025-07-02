const stripe = require('../config/stripe');

// Create a payment intent for checkout
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    // Stripe expects amount in the smallest currency unit (e.g., cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata
    });
    return res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe createPaymentIntent error:', error);
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
};

// Confirm a payment intent (server-side payment confirmation)
exports.pay = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId && !paymentMethodId) {
      return res.status(400).json({ message: 'paymentIntentId or paymentMethodId is required' });
    }

    let paymentIntent;
    if (paymentIntentId) {
      // Confirm an existing PaymentIntent
      paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    } else {
      // Create and confirm a new PaymentIntent with a saved payment method
      paymentIntent = await stripe.paymentIntents.create({
        amount:1000,
        currency:'usd',
        customer: req.user._id,
        payment_method: paymentMethodId,
        off_session: true, // Use this for off-session payments
        confirm: true,
      });
    }

    return res.json({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe pay error:', error);
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
}; 