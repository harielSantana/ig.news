import Head from "next/head";
import Image from 'next/image'

import { GetServerSideProps, GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";


//  Client Side: Quand
//  Server Side: Quando precisamos de indexação e dados dinâmicos da sessão do usuário.
//  Static Site Generation: Geralmente usado em páginas que seu conteúdo é compatilhado 
//   para diversos usuários e quando precisamos de indexação. 

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} mouth</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src="/images/avatar.svg" alt="Girl coding" width="500" height='500' />
      </main>
    </>
  );
}


// SSR - Chamada de Server Side Rendering
// export const getServerSideProps: GetServerSideProps = async () => {

// SSG - Chamada de Static Site Generation
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KoZF8A2kQfp3nasfEo17f95', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}