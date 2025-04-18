const layout = ({ children }: {
    children: React.ReactNode;
}) => {
 return (
    <div className="flex flex-col h-full w-full bg-red-100">
      <div className="flex-1">{children}</div>
    </div>
 );
}

export default layout;