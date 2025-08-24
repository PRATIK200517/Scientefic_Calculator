export const formatNumber = (num: number, notation: 'normal' | 'scientific' | 'engineering'): string => {
  if (!isFinite(num)) {
    return 'Error';
  }

  switch (notation) {
    case 'scientific':
      if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
        return num.toExponential(6);
      }
      return num.toPrecision(10).replace(/\.?0+$/, '');
      
    case 'engineering':
      if (Math.abs(num) >= 1000 || (Math.abs(num) < 0.001 && num !== 0)) {
        const exponent = Math.floor(Math.log10(Math.abs(num)));
        const engineeringExponent = Math.floor(exponent / 3) * 3;
        const mantissa = num / Math.pow(10, engineeringExponent);
        return `${mantissa.toFixed(3)}E${engineeringExponent}`;
      }
      return num.toString();
      
    default: // normal
      if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
      }
      
      if (num % 1 === 0) {
        return num.toString();
      }
      
      return parseFloat(num.toPrecision(12)).toString();
  }
};