/**
 * Language-switch tests.
 *
 * Run with: npm run test
 *
 * Verifies that switching language from a product page lands on the equivalent
 * product in the target language — not the homepage, and never a broken link.
 */
import "@/lib/slug-map";
import { switchPath } from "@/lib/routes";
import { products } from "@/content/products";


const cases: [string, string, string][] = [
  ["/ms/produk/dompet-bifold-full-grain-cognac", "en", "/en/products/cognac-full-grain-bifold-wallet"],
  ["/en/products/cognac-full-grain-bifold-wallet", "zh", "/zh/chan-pin/gan-yi-zong-quan-li-mian-dui-zhe-qian-bao"],
  ["/zh/chan-pin/ding-chang-zhen-pi-gou-qian-sheng", "ms", "/ms/produk/tali-cawak-anjing-kulit-panjang-tetap"],
  ["/en/mens-wallets", "ms", "/ms/dompet-lelaki"],
  ["/ms/dompet-lelaki", "zh", "/zh/nan-shi-qian-bao"],
  ["/en/leather-guide", "zh", "/zh/pi-ge-zhi-nan"],
  ["/en", "ms", "/ms"],
];
let fail = 0;
for (const [from, to, expected] of cases) {
  const got = switchPath(from, to as never, (f,t,s)=>{ 
    const p = products.find((x) => x.slug[f] === s);
    return p ? p.slug[t] : null;
  });
  const ok = got === expected;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${from} -> ${to}  =>  ${got}${ok?"":`  (expected ${expected})`}`);
}
// unknown product must return null, not a broken path
const unknown = switchPath("/en/products/no-such-product", "ms", () => null);
console.log(`${unknown === null ? "PASS" : "FAIL"}  unknown product -> null (no broken link)`);
process.exit(fail === 0 && unknown === null ? 0 : 1);
