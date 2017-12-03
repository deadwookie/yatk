export async function delay(delayMs: number): Promise<any> {
	return new Promise((resolve) => {
		setTimeout(resolve, delayMs)
	})
}
