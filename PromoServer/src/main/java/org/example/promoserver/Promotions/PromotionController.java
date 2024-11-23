package org.example.promoserver.Promotions;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Images;
import org.example.promoserver.Models.Promotions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/promotion")
    public ResponseEntity<?> addPromotion(@RequestBody Promotions promotion){
        promotionService.savePromotion(promotion);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/promotion")
    public ResponseEntity<?> updatePromotion(@RequestBody Promotions promotion){
        promotionService.updatePromotion(promotion);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/image")
    public ResponseEntity<?> addImage(@RequestBody Images images){
        promotionService.saveImage(images);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/image/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Integer id){
        promotionService.deleteImage(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{id}/promotions")
    public List<Promotions> getAllPromotionsForRestaurant(@PathVariable Integer id){
        return promotionService.getPromotionsForRestaurant(id);
    }

    @DeleteMapping("/promotion/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Integer id){
        promotionService.deletePromotion(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/promotion/{id}/images")
    public List<Images> getImagesForPromotion(@PathVariable Integer id) {
        return promotionService.getImagesForPromotion(id); // Dodaj tę metodę w serwisie
    }


}
