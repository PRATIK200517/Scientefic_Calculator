using CalculatorBackend.Models;
using CalculatorBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace CalculatorBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculatorController : ControllerBase
    {
        private readonly ICalculatorService _calculatorService;

        public CalculatorController(ICalculatorService calculatorService)
        {
            _calculatorService = calculatorService;
        }

        [HttpPost("calculate")]
        public async Task<ActionResult<CalculationResponse>> Calculate([FromBody] CalculationRequest request)
        {
            var result = await _calculatorService.CalculateExpressionAsync(request.Expression, request.AngleMode);
            return Ok(result);
        }

        [HttpPost("function")]
        public ActionResult<CalculationResponse> CalculateFunction([FromBody] FunctionRequest request)
        {
            var result = _calculatorService.CalculateFunction(request);
            return Ok(result);
        }

        [HttpPost("memory")]
        public ActionResult<MemoryResponse> MemoryOperation([FromBody] MemoryRequest request)
        {
            var result = _calculatorService.HandleMemoryOperation(request);
            return Ok(result);
        }

        [HttpPost("convert")]
        public ActionResult<UnitConversionResponse> ConvertUnit([FromBody] UnitConversionRequest request)
        {
            var result = _calculatorService.ConvertUnit(request);
            return Ok(result);
        }

        [HttpGet("constants")]
        public ActionResult<Dictionary<string, double>> GetConstants()
        {
            var constants = _calculatorService.GetConstants();
            return Ok(constants);
        }

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new { status = "OK", message = "Calculator API is running", timestamp = DateTime.UtcNow });
        }
    }
}