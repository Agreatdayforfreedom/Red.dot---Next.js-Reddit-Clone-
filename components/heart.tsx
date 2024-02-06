import styles from "@/components/css/heart.module.css";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  liked: boolean;
  clicked: boolean;
}

export default function Heart({ liked, clicked, ...props }: Props) {
  let heartIconClass = liked
    ? "fill-red-600"
    : "group-hover:fill-red-600 pt-px";
  let HeartIcon = liked ? FaHeart : FaRegHeart;
  return (
    <Button
      variant={"ghost"}
      className="rounded-full w-9 h-9 p-0 hover:bg-red-600/50 group"
      {...props}
    >
      <div className={`${styles.container} `}>
        {/* <div className={``}> */}
        <HeartIcon
          size={20}
          className={cn(
            "absolute top-0 left-0 right-0 bottom-0 m-auto",
            `${heartIconClass}`
          )}
        />
        {clicked && (
          <svg
            className={`none_fi ${styles.fi_icon} ${styles.fi_icon_fill} ${styles.hi_fav_explosion}
          }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle className={styles.explosion} cx="12" cy="12" r="8"></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="20"
              cy="12"
              r=".75"
              style={{ fill: "#147de5" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="19.91846879578665"
              cy="10.650420754361766"
              r=".5"
              style={{ fill: "#ffc000" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="16.972879746165315"
              cy="18.266615277019866"
              r=".75"
              style={{ fill: "#147de5" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="16.926943203175824"
              cy="18.54486444277137"
              r=".5"
              style={{ fill: "#147de5" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="10.182383242455304"
              cy="19.79078104702556"
              r=".75"
              style={{ fill: "#1bd6b4" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="10.486311661105013"
              cy="19.872096630662394"
              r=".5"
              style={{ fill: "#b25baf" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="4.76742286386351"
              cy="15.419039041870638"
              r=".75"
              style={{ fill: "#ffc000" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="5.634167923999488"
              cy="14.000702054580593"
              r=".5"
              style={{ fill: "#ffc000" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="4.825932669326824"
              cy="8.45983645364118"
              r=".75"
              style={{ fill: "#1bd6b4" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="4.833803538780229"
              cy="9.494569493035156"
              r=".5"
              style={{ fill: "#147de5" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="10.313633604553763"
              cy="4.179759058679224"
              r=".75"
              style={{ fill: "#147de5" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="10.80120673085787"
              cy="4.270899612031962"
              r=".5"
              style={{ fill: "#b25baf" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_1}`}
              cx="17.077543007541077"
              cy="5.817884099552103"
              r=".75"
              style={{ fill: "#ffc000" }}
            ></circle>
            <circle
              className={`${styles.particle} ${styles.particle_2}`}
              cx="17.270852881861437"
              cy="5.105744706123251"
              r=".5"
              style={{ fill: "#b25baf" }}
            ></circle>
          </svg>
        )}
      </div>
    </Button>
  );
}
