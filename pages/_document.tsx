import NextDocument, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';

const stylesServer = createStylesServer();

// @ts-ignore
export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);

    // Add your app specific logic here

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <ServerStyles html={initialProps.html} server={stylesServer} />
        </>
      ),
    };
  }
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body style={{ backgroundColor: '#f8fafc' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
