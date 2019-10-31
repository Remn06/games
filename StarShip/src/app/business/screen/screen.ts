export class Screen {

	private static defaultScreen: Screen;

	public width: number;
	public height: number;

	public static getDefaultScreen(): Screen {
		if (Screen.defaultScreen == null) {
			Screen.defaultScreen = new Screen();
		}
		return this.defaultScreen;
	}
}
