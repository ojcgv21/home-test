import { Drug, Pharmacy } from "./pharmacy";

const updateBenefit = drugs => {
  return new Pharmacy(drugs).updateBenefitValue();
};

const extractBenefits = drugs => {
  return drugs.map(d => d.benefit);
};

// return an array containing the differences between the benefit's drugs now and one day after
const computeDeltasBenefit = drugs => {
  const deltas = extractBenefits(drugs);
  updateBenefit(drugs);
  return deltas.map((delta, index) => delta - drugs[index].benefit);
};

describe("Pharmacy", () => {
  it("should decrease the benefit and expiresIn", () => {
    expect(new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()).toEqual(
      [new Drug("test", 1, 2)]
    );
  });

  it("Once the expiration date has passed, Benefit degrades twice as fast", () => {
    const drugsExpired = [
      new Drug("Other", -20, 10),
      new Drug("Other", 0, 10),
      new Drug("Herbal Tea", -10, 20),
      new Drug("Herbal Tea", 0, 15)
    ];
    const deltasDrugsExpired = computeDeltasBenefit(drugsExpired);
    const drugsNotExpired = [
      new Drug("Other", 15, 8),
      new Drug("Other", 14, 8),
      new Drug("Herbal Tea", 11, 22),
      new Drug("Herbal Tea", 1, 17)
    ];
    const deltasDrugsNotExpired = computeDeltasBenefit(drugsNotExpired);
    expect(deltasDrugsExpired).toEqual(deltasDrugsNotExpired.map(e => 2 * e));
  });

  it("The Benefit of an item is never negative", () => {
    const drugsZeroBen = [
      new Drug("Herbal Tea", -10, 0),
      new Drug("Magic Pill", 0, 0),
      new Drug("Fervex", -12, 0),
      new Drug("Other", -13, 0)
    ];
    const benefits = extractBenefits(updateBenefit(drugsZeroBen));
    expect(benefits.every(e => e >= 0)).toEqual(true);
  });

  it('"Herbal Tea" actually increases in Benefit the older it gets', () => {
    const herbalTeas = [
      new Drug("Herbal Tea", 5, 10),
      new Drug("Herbal Tea", -10, 20)
    ];
    const deltas = computeDeltasBenefit(herbalTeas);
    expect(deltas.every(e => e < 0)).toEqual(true);
  });

  it("The Benefit of an item is never more than 50.", () => {
    const herbalTeas = [
      new Drug("Herbal Tea", 5, 50),
      new Drug("Herbal Tea", -10, 50)
    ];
    const benefits = extractBenefits(updateBenefit(herbalTeas));
    expect(benefits.every(e => e <= 50)).toEqual(true);
  });

  it('"Magic Pill" never expires nor decreases in Benefit', () => {
    const magicPill = [new Drug("Magic Pill", 10, 10)];
    const magicPillAfterOneDay = [new Drug("Magic Pill", 10, 10)];
    expect(updateBenefit(magicPill)).toEqual(magicPillAfterOneDay);
  });

  it(
    "For 'Fervex' Benefit increases by 2 when there are 10 days or less and" +
      " by 3 when there are 5 days or less but Benefit drops to 0 after the expiration date.",
    () => {
      const fervexs = [
        new Drug("Fervex", 10, 20),
        new Drug("Fervex", 6, 30),
        new Drug("Fervex", 5, 10),
        new Drug("Fervex", 1, 15),
        new Drug("Fervex", 0, 40),
        new Drug("Fervex", -1, 20)
      ];
      const fervexsAfterOneDay = [
        new Drug("Fervex", 9, 22),
        new Drug("Fervex", 5, 32),
        new Drug("Fervex", 4, 13),
        new Drug("Fervex", 0, 18),
        new Drug("Fervex", -1, 0),
        new Drug("Fervex", -2, 0)
      ];
      expect(updateBenefit(fervexs)).toEqual(fervexsAfterOneDay);
    }
  );
});
