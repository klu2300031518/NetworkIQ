package com.networkiq.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.networkiq.backend.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}