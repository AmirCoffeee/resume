package com.shop.repository;

import com.shop.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByLocationAndParentIsNullAndActiveTrueOrderBySortOrder(
            MenuItem.MenuLocation location);
}
