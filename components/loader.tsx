import styles from "@/components/css/loader.module.css";

interface Props {
  width?: number;
  color?: string;
}

export default function Loader({ width, color = "#25b09b" }: Props) {
  let style = {};
  if (width)
    style = {
      width: `${width}px`,
      padding: `${width / 6.25}px`,
      background: color,
    };

  return <div className={styles.loader} style={style}></div>;
}
