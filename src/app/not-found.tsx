import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return <div className="section-shell not-found"><span><Icon name="search" size={44} /></span><p className="eyebrow">PAGE NOT FOUND</p><h1>この練習ページは見つかりませんでした</h1><p>大丈夫です。ホームへ戻って、別の入口からもう一度選べます。</p><div className="button-row"><Link className="button button-primary" href="/"><Icon name="home" />ホームへ戻る</Link><Link className="button button-secondary" href="/start">練習を選ぶ</Link></div></div>;
}
