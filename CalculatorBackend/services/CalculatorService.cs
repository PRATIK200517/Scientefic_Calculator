using System.Data;
using System.Text.RegularExpressions;
using CalculatorBackend.Models;

namespace CalculatorBackend.Services
{
    public class CalculatorService : ICalculatorService
    {
        private readonly Dictionary<string, double> _memory = new();

        public async Task<CalculationResponse> CalculateExpressionAsync(string expression, string angleMode)
        {
            try
            {
                // Simulate async operation
                await Task.Delay(1);

                var processedExpression = PreprocessExpression(expression, angleMode);
                var result = EvaluateExpression(processedExpression);

                return new CalculationResponse { Success = true, Result = result };
            }
            catch (Exception ex)
            {
                return new CalculationResponse { Success = false, Error = ex.Message };
            }
        }

        public CalculationResponse CalculateFunction(FunctionRequest request)
        {
            try
            {
                double result = request.Function.ToLower() switch
                {
                    "sin" => Math.Sin(ConvertToRadians(request.Value, request.AngleMode)),
                    "cos" => Math.Cos(ConvertToRadians(request.Value, request.AngleMode)),
                    "tan" => Math.Tan(ConvertToRadians(request.Value, request.AngleMode)),
                    "asin" => ConvertFromRadians(Math.Asin(request.Value), request.AngleMode),
                    "acos" => ConvertFromRadians(Math.Acos(request.Value), request.AngleMode),
                    "atan" => ConvertFromRadians(Math.Atan(request.Value), request.AngleMode),
                    "ln" => Math.Log(request.Value),
                    "log" => Math.Log10(request.Value),
                    "sqrt" => Math.Sqrt(request.Value),
                    "x²" => request.Value * request.Value,
                    "x³" => request.Value * request.Value * request.Value,
                    "10^x" => Math.Pow(10, request.Value),
                    "e^x" => Math.Exp(request.Value),
                    "n!" => Factorial((int)request.Value),
                    _ => throw new ArgumentException($"Unknown function: {request.Function}")
                };

                return new CalculationResponse { Success = true, Result = result };
            }
            catch (Exception ex)
            {
                return new CalculationResponse { Success = false, Error = ex.Message };
            }
        }

        public MemoryResponse HandleMemoryOperation(MemoryRequest request)
        {
            try
            {
                switch (request.Action.ToUpper())
                {
                    case "MS":
                        if (request.Value.HasValue)
                            _memory[request.Slot] = request.Value.Value;
                        break;

                    case "MR":
                        if (!_memory.ContainsKey(request.Slot))
                            return new MemoryResponse { Success = false, Error = $"Memory slot {request.Slot} is empty" };
                        break;

                    case "MC":
                        _memory.Remove(request.Slot);
                        break;

                    case "M+":
                        if (request.Value.HasValue && _memory.ContainsKey(request.Slot))
                            _memory[request.Slot] += request.Value.Value;
                        break;

                    case "M-":
                        if (request.Value.HasValue && _memory.ContainsKey(request.Slot))
                            _memory[request.Slot] -= request.Value.Value;
                        break;

                    default:
                        return new MemoryResponse { Success = false, Error = $"Unknown memory action: {request.Action}" };
                }

                return new MemoryResponse { Success = true, Memory = new Dictionary<string, double>(_memory) };
            }
            catch (Exception ex)
            {
                return new MemoryResponse { Success = false, Error = ex.Message };
            }
        }

        public UnitConversionResponse ConvertUnit(UnitConversionRequest request)
        {
            try
            {
                var conversionFactors = GetConversionFactors(request.Category);
                if (!conversionFactors.ContainsKey(request.FromUnit) || !conversionFactors.ContainsKey(request.ToUnit))
                    return new UnitConversionResponse { Success = false, Error = "Invalid units" };

                var fromFactor = conversionFactors[request.FromUnit];
                var toFactor = conversionFactors[request.ToUnit];
                var result = (request.Value / fromFactor) * toFactor;

                return new UnitConversionResponse { Success = true, Result = result };
            }
            catch (Exception ex)
            {
                return new UnitConversionResponse { Success = false, Error = ex.Message };
            }
        }

        public Dictionary<string, double> GetConstants()
        {
            return new Dictionary<string, double>
            {
                ["π"] = Math.PI,
                ["e"] = Math.E,
                ["c"] = 299792458,
                ["h"] = 6.62607015e-34,
                ["ħ"] = 1.054571817e-34,
                ["G"] = 6.67430e-11,
                ["k"] = 1.380649e-23,
                ["NA"] = 6.02214076e23,
                ["R"] = 8.314462618,
                ["σ"] = 5.670374419e-8,
                ["ε"] = 8.8541878128e-12,
                ["μ"] = 1.25663706212e-6,
                ["me"] = 9.1093837015e-31,
                ["mp"] = 1.67262192369e-27,
                ["mn"] = 1.67492749804e-27,
                ["qe"] = 1.602176634e-19,
                ["α"] = 7.2973525693e-3,
                ["g"] = 9.80665
            };
        }

        private string PreprocessExpression(string expression, string angleMode)
        {
            return expression
                .Replace(" ", "")
                .Replace("÷", "/")
                .Replace("×", "*")
                .Replace("√", "sqrt")
                .Replace("^", "**");
        }

        private double EvaluateExpression(string expression)
        {
            var dataTable = new DataTable();
            var result = dataTable.Compute(expression, "");
            return Convert.ToDouble(result);
        }

        private double ConvertToRadians(double value, string angleMode)
        {
            return angleMode.ToLower() switch
            {
                "deg" => value * Math.PI / 180,
                "grad" => value * Math.PI / 200,
                _ => value // radians
            };
        }

        private double ConvertFromRadians(double value, string angleMode)
        {
            return angleMode.ToLower() switch
            {
                "deg" => value * 180 / Math.PI,
                "grad" => value * 200 / Math.PI,
                _ => value // radians
            };
        }

        private double Factorial(int n)
        {
            if (n < 0) throw new ArgumentException("Factorial is not defined for negative numbers");
            if (n == 0 || n == 1) return 1;
            
            double result = 1;
            for (int i = 2; i <= n; i++)
            {
                result *= i;
            }
            return result;
        }

        private Dictionary<string, double> GetConversionFactors(string category)
        {
            return category.ToLower() switch
            {
                "length" => new Dictionary<string, double>
                {
                    ["m"] = 1, ["ft"] = 3.28084, ["in"] = 39.3701, ["cm"] = 100, ["mm"] = 1000, ["km"] = 0.001
                },
                "mass" => new Dictionary<string, double>
                {
                    ["kg"] = 1, ["g"] = 1000, ["lb"] = 2.20462, ["oz"] = 35.274
                },
                "temperature" => new Dictionary<string, double>
                {
                    ["c"] = 1, ["f"] = 1, ["k"] = 1 // Special handling needed for temperature
                },
                "area" => new Dictionary<string, double>
                {
                    ["m²"] = 1, ["ft²"] = 10.7639, ["in²"] = 1550, ["cm²"] = 10000
                },
                "volume" => new Dictionary<string, double>
                {
                    ["l"] = 1, ["ml"] = 1000, ["gal"] = 0.264172, ["qt"] = 1.05669
                },
                _ => throw new ArgumentException($"Unknown conversion category: {category}")
            };
        }
    }
}