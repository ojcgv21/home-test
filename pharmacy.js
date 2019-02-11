export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }
  updateBenefitValue() {
    for (let i = 0; i < this.drugs.length; i++) {
      // Magic Pill doesn't expire
      const deltaExpiresIn = this.drugs[i].name === "Magic Pill" ? 0 : -1;
      let deltaBenefit = computeBenefitUpdate(this.drugs[i]);
      // Once the expiration date has passed, Benefit degrades twice as fast
      deltaBenefit *= this.drugs[i].expiresIn <= 0 ? 2 : 1;
      this.drugs[i].benefit = computeBenefit(
        this.drugs[i].benefit,
        deltaBenefit
      );
      this.drugs[i].expiresIn += deltaExpiresIn;
    }
    return this.drugs;
  }
}

// we make sure than benefit is always between 0 and 50 included
const computeBenefit = (benefit, delta) => {
  let res = benefit + delta;
  if (res > 50) {
    res = 50;
  } else if (res < 0) {
    res = 0;
  }
  return res;
};

const computeBenefitUpdate = drug => {
  let deltaBenefit = -1;
  switch (drug.name) {
    case "Herbal Tea":
      deltaBenefit = 1;
      break;
    case "Magic Pill":
      deltaBenefit = 0;
      break;
    case "Fervex":
      deltaBenefit = computeBenefitUpdateFervex(drug);
      break;
    default:
      break;
  }
  return deltaBenefit;
};

const computeBenefitUpdateFervex = drug => {
  let delta = -drug.benefit;
  if (drug.expiresIn > 10) {
    delta = 1;
  } else if (drug.expiresIn <= 10 && drug.expiresIn > 5) {
    delta = 2;
  } else if (drug.expiresIn <= 5 && drug.expiresIn > 0) {
    delta = 3;
  }
  return delta;
};
