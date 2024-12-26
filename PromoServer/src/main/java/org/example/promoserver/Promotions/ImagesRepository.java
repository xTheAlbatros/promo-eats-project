package org.example.promoserver.Promotions;

import org.example.promoserver.Models.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ImagesRepository extends JpaRepository<Images, Integer> {
    List<Images> findByPromotion_Id(Integer promotionId);
}

