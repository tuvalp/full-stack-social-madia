import { useEffect } from "react";
import { useErrorContext } from "../contexts/ErrorContext";

export default function Errors() {
  const { errors, removeError } = useErrorContext();

  useEffect(() => {
    if (errors.length === 0) return;

    const timers = errors.map((error) =>
      setTimeout(() => {
        removeError(error);
      }, 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [errors, removeError]);

  return (
    <>
      {errors.map((error, i) => (
        <div key={i} className="snackbar">
          {error}
        </div>
      ))}
    </>
  );
}
