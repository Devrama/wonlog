let _logID = 0;
const INTERVAL = 2000;

setInterval(() => {
  _logID++;
  const log = {
    message: `After ${INTERVAL} seconds, server sends "getting better!" to the client! The flex-grow property specifies how much the item will grow relative to the rest of the flexible items inside the same container. Note: If the element is not a flexible item, the flex-grow property has no effect.`,
  };

  const logData = {
    wonlogMetadata: {
      logID: _logID,
      datetime: new Date(),
      propertyNames: Object.keys(log),
    },
    ...log,
  };
  console.log(JSON.stringify(logData));
}, INTERVAL);
