import styles from "@/components/css/loader.module.css";

interface Props {
  width?: number;
}

export default function Loader({ width }: Props) {
  let style = {};
  if (width) style = { width: `${width}px`, padding: `${width / 6.25}px` };

  return <div className={styles.loader} style={style}></div>;
}
