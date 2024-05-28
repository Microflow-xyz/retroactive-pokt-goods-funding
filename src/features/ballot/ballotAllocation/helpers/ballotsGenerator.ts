const ratio = {
  HIGHEST: 0.1,
  HIGH: 0.2,
  MID: 0.3,
  LOW: 0.4,
};

function check(input) {
  let inputSum = 0;
  for (let i in input) inputSum += input[i];
  if (inputSum === 0) return true;
  const inputRatio = {
    highest: input.highest / inputSum,
    high: input.high / inputSum,
    mid: input.mid / inputSum,
    low: input.low / inputSum,
  };
  if (ratio.HIGHEST < inputRatio.highest) return false;
  if (ratio.HIGH + (ratio.HIGHEST - inputRatio.highest) < inputRatio.high)
    return false;
  if (
    ratio.MID +
      (ratio.HIGHEST - inputRatio.highest) +
      (ratio.HIGH - inputRatio.high) <
    inputRatio.mid
  )
    return false;
  return true;
}

function generateTierCombinationsForTotal(total) {
  const combinations = [];
  const baseRatios = { Highest: 0.1, High: 0.2, Mid: 0.3, Low: 0.4 };

  // Iterate over possible values for 'Highest' tier
  for (let highest = 0; highest <= total * baseRatios.Highest; highest++) {
    let remainingAfterHighest = total - highest;

    // Iterate over possible values for 'High' tier
    for (
      let high = 0;
      high <=
      Math.min(
        remainingAfterHighest,
        total * (baseRatios.Highest + baseRatios.High) - highest,
      );
      high++
    ) {
      let remainingAfterHigh = remainingAfterHighest - high;

      // Iterate over possible values for 'Mid' tier
      for (
        let mid = 0;
        mid <=
        Math.min(
          remainingAfterHigh,
          total * (baseRatios.Highest + baseRatios.High + baseRatios.Mid) -
            highest -
            high,
        );
        mid++
      ) {
        let low = remainingAfterHigh - mid; // All remaining is allocated to 'Low'

        // Ensure the 'Low' tier also does not exceed its maximum ratio
        if (low <= total - highest - high - mid) {
          combinations.push({
            highest: highest,
            high: high,
            mid: mid,
            low: low,
          });
        }
      }
    }
  }

  return combinations.reverse();
}

export const gen = (input) => {
  if (check(input))
    return {
      highest: 0,
      high: 0,
      mid: 0,
      low: 0,
    };
  let inputSum = 0;
  for (let i in input) inputSum += input[i];
  let suggestions;
  while (true) {
    inputSum++;
    suggestions = generateTierCombinationsForTotal(inputSum);
    let i = 1;
    let suggest;
    for (let i = 0; i < suggestions.length; ) {
      suggest = suggestions[i];
      if (
        input.highest > suggest.highest ||
        input.high > suggest.high ||
        input.mid > suggest.mid ||
        input.low > suggest.low
      )
        suggestions.splice(i, 1);
      else i++;
    }
    if (suggestions.length > 0) break;
  }
  const suggest = suggestions[0];
  const missing = {
    highest: suggest.highest - input.highest,
    high: suggest.high - input.high,
    mid: suggest.mid - input.mid,
    low: suggest.low - input.low,
  };
  if (missing.high < 0) {
    missing.highest += missing.high;
    missing.high = 0;
  }
  if (missing.mid < 0) {
    missing.high += missing.mid;
    if (missing.high < 0) {
      missing.highest += missing.high;
      missing.high = 0;
    }
    missing.mid = 0;
  }
  if (missing.low < 0) {
    if (missing.low * -1 > missing.mid + missing.high + missing.highest)
      return {
        highest: 0,
        high: 0,
        mid: 0,
        low: 0,
      };
    missing.mid += missing.low;
    if (missing.mid < 0) {
      missing.high += missing.mid;
      if (missing.high < 0) {
        missing.highest += missing.high;
        missing.high = 0;
      }
      missing.mid = 0;
    }
    missing.low = 0;
  }
  return missing;
};