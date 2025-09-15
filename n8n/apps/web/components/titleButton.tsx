interface titleButtontypes {
  title: string;
  clicked: string | null;
  setClicked: (title: string) => void;
}

export default function TitleButton({ title, clicked, setClicked }: titleButtontypes) {
  return (
    <div
      className={
        clicked === title
          ? "text-orange-700 border-b-2 border-orange-700 pb-2 cursor-pointer"
          : "text-white cursor-pointer pb-2"
      }
      onClick={() => setClicked(title)}
    >
      {title}
    </div>
  );
}
