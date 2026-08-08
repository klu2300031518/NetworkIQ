package com.networkiq.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.networkiq.backend.ai.PythonAIService;
import com.networkiq.backend.entity.Inventory;
import com.networkiq.backend.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin("*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private PythonAIService pythonAIService;

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryService.saveInventory(inventory);
    }

    @PostMapping("/recommend")
    public Map<String, Object> getRecommendation(@RequestBody Inventory inventory) {

        Map<String, Object> request = new HashMap<>();

        request.put("stock", inventory.getStock());
        request.put("demand", inventory.getDemand());
        request.put("transferCost", inventory.getTransferCost());

        return pythonAIService.getRecommendation(request);
    }
}