package com.intelvestor.controller;

import com.intelvestor.model.MLResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public StockController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/{symbol}/predict")
    public ResponseEntity<MLResponse> predict(@PathVariable String symbol,
            @RequestParam(defaultValue = "30") int horizon) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> mlRequest = Map.of("symbol", symbol, "horizon", horizon);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(mlRequest, headers);

        ResponseEntity<MLResponse> mlResponse = restTemplate.exchange(
                mlServiceUrl + "/ml/predict",
                HttpMethod.POST,
                requestEntity,
                MLResponse.class);

        return mlResponse.getStatusCode().is2xxSuccessful() ? ResponseEntity.ok(mlResponse.getBody())
                : ResponseEntity.status(mlResponse.getStatusCode()).build();
    }
}