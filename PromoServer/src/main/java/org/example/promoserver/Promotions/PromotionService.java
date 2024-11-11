package org.example.promoserver.Promotions;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Images;
import org.example.promoserver.Models.Promotions;
import org.example.promoserver.Models.Restaurants;
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

    public void saveImage(Images images){
        if(promotionRepository.existsById(images.getId())){
            imagesRepository.save(images);
        }else{
            throw new RestaurantNotFoundException();
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

}
