export const clientTemplate = `export function execute<Data, Variables>(
  query: string,
  variables?: Variables
): () => Promise<Data> {
  return async () => {
    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      query,
      variables,
    });

    const response = await fetch("/graphql", {
      method: "POST",
      headers,
      body,
    });

    const json = await response.json();
    const error = json.errors && json.errors[0];

    if (error) {
      throw new Error(error.message);
    }

    return json.data;
  };
}`;
