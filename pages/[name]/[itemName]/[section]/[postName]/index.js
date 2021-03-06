import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        {...props}
      />
    ) : (
      <code className={className} {...props} />
    );
  },
};

const source = `
~~~jsx
const React = require('react')
const ReactMarkdown = require('react-markdown')
const render = require('react-dom').render
const gfm = require('remark-gfm')

const markdown = 'Just a link: https://reactjs.com.'
~~~


Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.
`;

export default function Section({
  posts,
  itemName,
  section,
  acc = "blue",
  logo = "ri-dashboard-fill",
  url,
  markdownData,
}) {
  const router = useRouter();
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
        <div className={`subSideBar ${acc}`}>
          <button>
            <i className={logo}></i>
          </button>
          <div></div>

          <button
            className={`backButton ${acc}Btn`}
            onClick={() => {
              const route = router.asPath;
              const prevRoute = route.substring(0, route.lastIndexOf("/"));
              router.replace(prevRoute);
            }}
          >
            <i className="ri-arrow-go-back-fill"></i>
          </button>
        </div>
        <section className="markDownSection">
          <ReactMarkdown
            components={components}
            className="markdown"
            children={markdownData}
            //children={source}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[[gfm, { singleTilde: false }]]}
          />
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const { name, itemName, section, postName } = context.params;
  const URL = "https://raw.githubusercontent.com/epicX67/md_blogs/main";

  const mUrl = `${URL}/categories/${name}/${itemName}/${section}/posts.json`;
  const sUrl = `${URL}/categories/${name}.json`;

  const res = await fetch(mUrl);
  const posts = await res.json();
  // New
  const post = posts.find((item) => item.title === postName);
  const postMdRes = await fetch(post.markdown_url);
  const markdownData = await postMdRes.text();

  const sRes = await fetch(sUrl);
  const sData = await sRes.json();

  const sItem = sData.items.find((item) => itemName === item.name);
  const logo = sItem.options.find((item) => item.name === section).logo;

  return {
    props: {
      posts: posts,
      itemName: itemName,
      section: section,
      logo: logo,
      acc: sData.configs.acc,
      markdownData: markdownData,
      url: post.markdown_url,
    },
  };
}

export async function getStaticPaths() {
  const URL = "https://raw.githubusercontent.com/epicX67/md_blogs/main";
  const mUrl = `${URL}/DB.json`;
  const res = await fetch(mUrl);
  const data = await res.json();

  const names = data.map((item) => item);

  let paths = [];

  for (let i = 0; i < names.length; i++) {
    const cUrl = `${URL}/categories/${names[i].name.toLowerCase()}.json`;
    const cRes = await fetch(cUrl);
    const cData = await cRes.json();

    const items = cData.items.map((item) => item);
    for (let j = 0; j < items.length; j++) {
      for (let k = 0; k < items[j].options.length; k++) {
        //const sUrl = `${URL}/categories/${names[i]}/${items[j].options[k].name}/posts.json`;

        /* New Addition */
        const pUrl = `${URL}/categories/${names[i].name.toLowerCase()}/${
          items[j].name
        }/${items[j].options[k].name}/posts.json`;
        const pRes = await fetch(pUrl);
        const posts = await pRes.json();

        for (let x = 0; x < posts.length; x++) {
          paths.push({
            params: {
              name: names[i].name.toLowerCase(),
              itemName: items[j].name,
              section: items[j].options[k].name,
              postName: posts[x].title,
            },
          });
        }
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
}
