namespace CalculatorBackend.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Error { get; set; }

        public static ApiResponse<T> SuccessResponse(T data) => new() { Success = true, Data = data };
        public static ApiResponse<T> ErrorResponse(string error) => new() { Success = false, Error = error };
    }
}