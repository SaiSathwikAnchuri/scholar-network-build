module.exports = {
  sendMail: ({ to, subject, text }) => {
    console.log(`Simulated email to ${to}\nSubject: ${subject}\n${text}`);
    // Place real mail logic here.
    return Promise.resolve();
  }
};
