namespace CalculatorBackend.Models
{
    public class CalculationRequest
    {
        public string Expression { get; set; } = "";
        public string AngleMode { get; set; } = "deg";
    }

    public class CalculationResponse
    {
        public bool Success { get; set; }
        public double? Result { get; set; }
        public string? Error { get; set; }
    }

    public class MemoryRequest
    {
        public string Action { get; set; } = ""; // "MS", "MR", "MC", "M+", "M-"
        public string Slot { get; set; } = "M1";
        public double? Value { get; set; }
    }

    public class MemoryResponse
    {
        public bool Success { get; set; }
        public Dictionary<string, double> Memory { get; set; } = new();
        public string? Error { get; set; }
    }

    public class FunctionRequest
    {
        public string Function { get; set; } = ""; // "sin", "cos", "tan", etc.
        public double Value { get; set; }
        public string AngleMode { get; set; } = "deg";
    }

    public class UnitConversionRequest
    {
        public string Category { get; set; } = "length";
        public string FromUnit { get; set; } = "";
        public string ToUnit { get; set; } = "";
        public double Value { get; set; }
    }

    public class UnitConversionResponse
    {
        public bool Success { get; set; }
        public double Result { get; set; }
        public string? Error { get; set; }
    }
}