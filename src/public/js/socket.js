const socket = io();

socket.on("services:changed", async (data) => {
  console.log(
    "Cambio recibido desde el servidor:",
    data
  );

  try {
    const response = await fetch(
      window.location.pathname,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "No se pudo actualizar la vista."
      );
    }

    const html = await response.text();

    const parser = new DOMParser();

    const updatedDocument = parser.parseFromString(
      html,
      "text/html"
    );

    const updatedMain =
      updatedDocument.querySelector(
        "main.container"
      );

    const currentMain =
      document.querySelector(
        "main.container"
      );

    if (!updatedMain || !currentMain) {
      throw new Error(
        "No se encontró el contenido de la vista."
      );
    }

    currentMain.replaceChildren(
      ...updatedMain.childNodes
    );

    console.log(
      "Vista actualizada correctamente."
    );
  } catch (error) {
    console.error(
      "Error de actualización:",
      error.message
    );
  }
});