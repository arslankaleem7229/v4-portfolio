import NextHead from 'next/head';
import { useRouter } from 'next/router';
import { siteMeta } from '@config';

type HeadProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Head = ({ title, description, image }: HeadProps) => {
  const { asPath } = useRouter();
  const imageUrl =
    image && image.startsWith('http')
      ? image
      : `${siteMeta.siteUrl}${image || siteMeta.image}`;

  const meta = {
    title: title ? `${title} | ${siteMeta.title}` : siteMeta.title,
    description: description || siteMeta.description,
    image: imageUrl,
    url: `${siteMeta.siteUrl}${asPath}`,
  };

  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="image" content={meta.image} />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={siteMeta.twitterUsername} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      <meta name="google-site-verification" content="DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk" />
      <link rel="icon" href="/favicon-32x32.png" />
    </NextHead>
  );
};

export default Head;
