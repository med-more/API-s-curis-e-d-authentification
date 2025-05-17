exports.sendPhoneVerificationCode = async (user) => {
  console.log(`
    [SIMULATION SMS]
    À: ${user.phone}
    
    Contenu:
    Votre code de vérification Auth System est : ${user.phoneVerificationCode}. Il expire dans 10 minutes.
  `);
  
  return true;
};