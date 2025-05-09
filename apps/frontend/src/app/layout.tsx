import './global.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata = {
  title: 'Welcome to frontend',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
