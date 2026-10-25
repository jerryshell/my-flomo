const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>My Flomo · 自托管想法记录与回顾</p>
        <p>
          MIT License ·{" "}
          <a
            className="underline-offset-4 hover:underline"
            href="https://github.com/jerryshell"
            target="_blank"
            rel="noreferrer"
          >
            @jerryshell
          </a>{" "}
          ·{" "}
          <a
            className="underline-offset-4 hover:underline"
            href="https://github.com/zcyc"
            target="_blank"
            rel="noreferrer"
          >
            @zcyc
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
