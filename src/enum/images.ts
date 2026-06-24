export const Images = {
  GREEN: 'GREEN',
  BLACK_STAR: 'BLACK_STAR',
  BLUE_STAR: 'BLUE_STAR',
  WHITE_STAR: 'WHITE_STAR',
  GREEN_STAR: 'GREEN_STAR',
  RED_STAR: 'RED_STAR',
  YELLOW_STAR: 'YELLOW_STAR',
} as const;

export type Images = keyof typeof Images;

export function getImageUrl(image: Images): string {
    switch (image) {
        case Images.GREEN:
            return "https://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";
        case Images.BLACK_STAR:
            return "./gameAssets/blackStar.svg";
        case Images.BLUE_STAR:
            return "./gameAssets/blueStar.svg";
        case Images.WHITE_STAR:
            return "./gameAssets/whiteStar.svg";
        case Images.GREEN_STAR:
            return "./gameAssets/greenStar.svg";
        case Images.RED_STAR:
            return "./gameAssets/redStar.svg";
        case Images.YELLOW_STAR:
            return "./gameAssets/yellowStar.svg";
        default:
            const searchedImage: never = image;
            throw new Error(`Unknown image: ${searchedImage}`);
    }
}