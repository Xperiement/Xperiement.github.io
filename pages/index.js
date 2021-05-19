import Head from "next/head";
import Link from "next/link";

export default function Home({ items }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </Head>

      <main>
        <a target="_blank" href="Game.html" className="heading">
          <img src="hub.svg" alt="" />
        </a>

        <div className="mCategories">
          {items.map((item) => {
            return (
              <Link key={item.name} href={`/${item.name.toLowerCase()}`}>
                <div className={`mCard ${item.acc}`}>
                  <p>{item.name}</p>
                  <i className={item.logo}></i>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const res = await fetch(
    "https://raw.githubusercontent.com/epicX67/md_blogs/main/DB.json"
  );
  const data = await res.json();

  return {
    props: {
      items: data,
    },
  };
}
