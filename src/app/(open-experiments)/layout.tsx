import localFont from 'next/font/local';

const geist = localFont({
  src: [
    {path:'../../../public/portfolio/media/ccce59465ae5c61930ad.ttf',weight:'400',style:'normal'},
    {path:'../../../public/portfolio/media/a8eefb873ba9c9020665.ttf',weight:'500',style:'normal'},
  ],
  display:'swap',
});

export default function OpenExperimentsLayout({children}:{children:React.ReactNode}) {
  return <div className={geist.className}>{children}</div>;
}
