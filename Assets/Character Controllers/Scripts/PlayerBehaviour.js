@script RequireComponent(CreatureController)
private var CreatureControl : CreatureController;

private var moveMode : int = 1;
private var RotateSpeed = 3.0;

function Start ()
{	
	CreatureControl = GetComponent(CreatureController);
} 

function Update () {
	checkPlayerState();
}

function checkPlayerState () {

		if (CreatureControl.GetJumping() == false) { // if you're not jumping
		
			if (Input.GetMouseButton (0) && Input.GetMouseButton (1)) { // if two mouse buttons are clicked
				if (moveMode == 0) {
					CreatureControl.setCreatureState("walk");
				} else if (moveMode == 1) {
					CreatureControl.setCreatureState("run");
				}
			} else if (Input.GetAxis ("Vertical")) {
				 // if the backward key is pressed
				if (Input.GetAxis ("Vertical") < 0) {
					if (moveMode == 0) {
						CreatureControl.setCreatureState("walkbackward");
					} else if (moveMode == 1) {
						CreatureControl.setCreatureState("runbackward"); // only needed for development
					}
				 // if the forward key is pressed	
				} else {
					if (moveMode == 0) {
						CreatureControl.setCreatureState("walk");
					} else if (moveMode == 1) {
						CreatureControl.setCreatureState("run");
					}
				}	
			} else {
				CreatureControl.setCreatureState("idle");
			}
			
			if (Input.GetAxis ("Horizontal")) { // if rotate key is pressed
				if (Input.GetAxis ("Horizontal") < 0) {	
					transform.Rotate((Vector3.up * Time.deltaTime * RotateSpeed * 20) * -1);
				} else {
					transform.Rotate((Vector3.up * Time.deltaTime * RotateSpeed * 20) * 1);
				}
			}
			if (Input.GetButton ("Jump")) { // if jump key is pressed
				CreatureControl.setCreatureState("jump");
			}	
		}

		if (Input.GetKeyDown ("r")) { // if the run key is pressed
			switch(moveMode)
			{
				case 0: // if its walk, make it run
					moveMode = 1;
					break;
				case 1: // if its run, make it walk
					moveMode = 0;
					break;
			}
		}
}
