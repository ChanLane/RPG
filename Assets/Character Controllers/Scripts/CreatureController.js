@script RequireComponent(CharacterController)

// state variables
private var grounded : boolean = false;
private var moveDirection = Vector3.zero; 
private var jumping : boolean = false;

private var CreatureState : String = "idle";
private var lastState : String = "idle";

// statistic variables
private var speed;
var walkSpeed = 3.0;
var runSpeed = 8.0;
var jumpSpeed = 8.0;
var strength = 3.0;

var Alive : boolean = true;
static var gravity : float = 20.0;

// Prefab settings for puppet
var puppetPrefab : Transform;
private var puppetInstance : Transform;
var shadowPrefab : Transform;
private var shadowInstance : Transform;
var UseBlobShadow : boolean = true;

private var startRotation;
var originalPosition: Vector3;
var originalRotation: Quaternion;

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

function Start ()
{	
	originalPosition = transform.position;
	originalRotation = transform.rotation;
	// remember the original rotation
	startRotation = transform.rotation.eulerAngles.y;

	var allDummys : GameObject[];
	allDummys = GameObject.FindGameObjectsWithTag("EditorOnly");
	for (var Dummy : GameObject in allDummys) {
		Destroy (Dummy);
	}
	
	Spawn();
	
} 

function Spawn() {
	// set health to maxhealth
	speed = walkSpeed;
	Alive = true;
	
	// reset to the original position, important for respawns
	transform.position = originalPosition;
	transform.rotation = originalRotation;
	
	// instanciate the desired puppet (Mesh)
	puppetInstance = Instantiate (puppetPrefab, Vector3(0, 0, 0), Quaternion.Euler(Vector3(0, 0, 0)));
	puppetInstance.renderer.enabled = true;
	puppetInstance.parent = transform;
	//puppetInstance.name = "creature " + " nr";
	puppetInstance.localPosition = new Vector3(0, -1, 0);
	puppetInstance.transform.Rotate(-90,startRotation,-90);
	
   	// Set all animations to loop
   	puppetInstance.animation.wrapMode = WrapMode.Loop;
   	puppetInstance.animation["melee_punch"].wrapMode = WrapMode.Once;
   	// define the animation layers
   	puppetInstance.animation["battlestance"].layer = 0;
   	puppetInstance.animation["idle"].layer = 0;
   	puppetInstance.animation["walk"].layer = 0;
   	puppetInstance.animation["run"].layer = 0;
   	puppetInstance.animation["jump"].layer = 0;
   	puppetInstance.animation["dropdead"].layer = 0;
   	puppetInstance.animation["melee_punch"].layer = 1;
   	puppetInstance.animation["jump"].enabled = true;
   	// Stop animations from playing
   	puppetInstance.animation.Stop();
   	puppetInstance.animation.Play("jump");
   	
   	// instanciate the shadow (shadow projector)
	shadowInstance = Instantiate (shadowPrefab, Vector3(0, 0, 0), Quaternion.Euler(Vector3(0, 0, 0)));
	shadowInstance.parent = transform;
	shadowInstance.name = "creature shadow";
	shadowInstance.localPosition = new Vector3(0, 1, 0);
	shadowInstance.transform.Rotate(90,0,0);
}

function ToggleBlobShadow(){
	shadowInstance.renderer.enabled = UseBlobShadow;
	puppetInstance.renderer.castShadows = !UseBlobShadow;
}

function StartSpawnRoutine() {
	StartCoroutine ("SpawnRoutine", 5);
}

function SpawnRoutine(SpawnTime : int) {
	yield WaitForSeconds (SpawnTime);
	puppetInstance.renderer.enabled = false;
	yield WaitForSeconds (SpawnTime);
	Spawn();
}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

function Update () {
	if (grounded) {
		if (!jumping) {
			// remember the last action state unless it is fall so we can revert back when landed
			if (lastState != "fall") {
				lastState = CreatureState;  
			}
			doAction();
		}
	} else {
		CreatureState = "fall";
		doAction();
	}
	// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime;
	// Move the controller
	var controller : CharacterController = GetComponent(CharacterController);
	var flags = controller.Move(moveDirection * Time.deltaTime);
	grounded = (flags & CollisionFlags.CollidedBelow) != 0;
}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

function setCreatureState( theState : String ) {
	CreatureState = theState;
}

function GetJumping() {
	return jumping;
}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

function doAction() {
	switch(CreatureState) 
  			{
  				case "idle" :
					speed = 0.0;
					puppetInstance.animation["idle"].speed = 1.0;
					puppetInstance.animation.CrossFade("idle", 0.2);
					moveDirection = new Vector3(0, 0, 0);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
  				case "battlestance" :
					speed = 0.0;
					puppetInstance.animation["battlestance"].speed = 1.0;
					puppetInstance.animation.CrossFade("battlestance", 0.2);
					moveDirection = new Vector3(0, 0, 0);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
				case "walk" :
					speed = walkSpeed;
					puppetInstance.animation["walk"].speed = 1.0;
					puppetInstance.animation.CrossFade("walk", 0.2);
					moveDirection = new Vector3(0, 0, 1);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
  				case "walkbackward" :
					speed = walkSpeed;
					puppetInstance.animation["walk"].speed = -1.0;
					puppetInstance.animation.CrossFade("walk", 0.2);
					moveDirection = new Vector3(0, 0, -1);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
				case "run" :
					speed = runSpeed;
					puppetInstance.animation["run"].speed = 1.1;
					puppetInstance.animation.CrossFade("run", 0.2);
					moveDirection = new Vector3(0, 0, 1);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
  				case "runbackward" :
					speed = runSpeed;
					puppetInstance.animation["walk"].speed = -1.1;
					puppetInstance.animation.CrossFade("walk", 0.2); 
					moveDirection = new Vector3(0, 0, -1);
					moveDirection = transform.TransformDirection(moveDirection);
					moveDirection *= speed;
					break;
  				case "sneak" :
  					break;
  				case "fall" :
  					puppetInstance.animation.CrossFade("run", 0.1);
					jumping = true;
  					break;
  				case "jump" :
  					puppetInstance.animation.CrossFade("jump", 0.1);
					moveDirection.y = jumpSpeed;
					jumping = true;
  					break;
  				case "punch" :
  					puppetInstance.animation["melee_punch"].speed = 1.0;
  					puppetInstance.animation.CrossFade("melee_punch", 0.1);
  					break;
  				case "death" :
  					puppetInstance.animation["dropdead"].speed = 1.0;
  					puppetInstance.animation.CrossFade("dropdead", 0.1);
  					break;
			}
}

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

function OnControllerColliderHit (hit : ControllerColliderHit) {
	// if you are jumping, stop it
	if (jumping) {
		jumping = false; // switch jumpstate off
		CreatureState = lastState;
	}
	// if there is no rigidbody, destroy any parenting and exit
	var body : Rigidbody = hit.collider.attachedRigidbody;
	if (body == null) {
		transform.parent = null;
		return;
	}
	// if the object below is a rigidbody and kinematic, parent to it and exit
	if (hit.moveDirection.y < -0.3) {
		if (body.isKinematic) {
			transform.parent = hit.transform;
		}
		return;
	}
	// if the rigidbody is kinematic, but not below us, exit
	if (body.isKinematic) {
		return;
	}
	// Calculate push direction from move direction, we only push objects to the sides never up and down
	var pushDir = Vector3 (hit.moveDirection.x, 0, hit.moveDirection.z);
	// If you know how fast your character is trying to move, then you can also multiply the push velocity by that.
	// Apply the push
	body.velocity = pushDir * strength;
	
}





