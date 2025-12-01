import './DemoButton.scss';

export const DemoButton = ({ children }: { children: React.ReactNode }) => {
  return <button className="example-btn">{children}</button>;
};
