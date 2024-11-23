package org.example.promoserver.Promotions;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Images;
import org.example.promoserver.Models.Promotions;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Promotions.exceptions.ImageNotFoundException;
import org.example.promoserver.Promotions.exceptions.PromotionNotFoundException;
import org.example.promoserver.Promotions.validator.PromotionValidator;
import org.example.promoserver.Restaurant.RestaurantRepository;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final ImagesRepository imagesRepository;
    private final RestaurantRepository restaurantRepository;

    public void savePromotion(Promotions promotions){

        PromotionValidator.validatePromotion(promotions, restaurantRepository);

        promotionRepository.save(promotions);
    }

    @Transactional
    public void updatePromotion(Promotions promotions){
        PromotionValidator.validateUpdatePromotion(promotions, restaurantRepository);
        Promotions existingPromotion = promotionRepository.findById(promotions.getId())
                .orElseThrow(PromotionNotFoundException::new);

        if (promotions.getDescription() != null) {
            existingPromotion.setDescription(promotions.getDescription());
        }
        if (promotions.getStartTime() != null) {
            existingPromotion.setStartTime(promotions.getStartTime());
        }
        if (promotions.getEndTime() != null) {
            existingPromotion.setEndTime(promotions.getEndTime());
        }
        if (promotions.getRestaurant() != null) {
            existingPromotion.setRestaurant(promotions.getRestaurant());
        }
        if (promotions.getImages() != null) {
            existingPromotion.setImages(promotions.getImages());
        }

        promotionRepository.save(existingPromotion);
    }

    public void saveImage(Images images) {
        if (images.getPromotion() != null && promotionRepository.existsById(images.getPromotion().getId())) {
            imagesRepository.save(images);
        } else {
            throw new PromotionNotFoundException();
        }
    }

    @Transactional
    public List<Promotions> getPromotionsForRestaurant(Integer restaurantId){
        Restaurants foundRestaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);

        return Optional.ofNullable(promotionRepository.findByRestaurant(foundRestaurant))
                .filter(promotions -> !promotions.isEmpty())
                .orElseThrow(() -> new PromotionNotFoundException("No promotions found for restaurant"));
    }

    @Transactional
    public void deletePromotion(Integer promotionId){
        Optional<Promotions> foundPromotion = Optional.ofNullable(promotionRepository.findById(promotionId)
                .orElseThrow(PromotionNotFoundException::new));
        foundPromotion.ifPresent(promotionRepository::delete);
    }

    public List<Images> getImagesForPromotion(Integer promotionId) {
        return imagesRepository.findByPromotion_Id(promotionId);
    }

    @Transactional
    public void deleteImage(Integer id){
        Images foundImage = imagesRepository.findById(id)
                .orElseThrow(ImageNotFoundException::new);

        Promotions promotion = foundImage.getPromotion();
        if (promotion != null) {
            promotion.getImages().remove(foundImage);
        }

    }
}
