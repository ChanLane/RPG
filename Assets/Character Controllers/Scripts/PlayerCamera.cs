using UnityEngine;
using System.Collections;

// ----------------------------------------------------
// a modification of the original character controller script 
// to behave more like an RPG third person controller
// ----------------------------------------------------------

[AddComponentMenu("Camera-Control/PlayerCamera")]
public class PlayerCamera : MonoBehaviour {

	public enum RotationAxes { MouseZoom = 0, MouseX = 1, MouseY = 2 }
	public RotationAxes axes = RotationAxes.MouseZoom;
	public float sensitivityX = 15F;
	public float sensitivityY = 15F;

	public float minimumX = -360F;
	public float maximumX = 360F;

	public float minimumY = -60F;
	public float maximumY = 60F;
	
	public float minimumZ = -0.5F;
	public float maximumZ = -6F;

	float rotationX = 0F;
	float rotationY = 0F;
	
	float ZoomZ = 0F;
	
	Quaternion originalRotation;

	void Update ()
	{
		// ----------------------------------------------------
		// zoom functions
		// new function to have a scrollwheel zoom from 3rd to 1st person
		// goes on the camera.  not yet exactly as it should be, though
		// ----------------------------------------------------------
		if (axes == RotationAxes.MouseZoom)
		{
			ZoomZ = Input.GetAxis("Zoomer");
			// if the position is between the limits, translate
			if (transform.localPosition.z >= -10 && transform.localPosition.z <= 0)
				transform.Translate(Vector3.forward * ZoomZ);
			// if it is to far back, hold
			if (transform.localPosition.z < -10)
				transform.Translate(0,0,0.2F);
			// if it is to far front, hold
			if (transform.localPosition.z > 0)
				transform.Translate(0,0,-0.2F);
		}
		// ----------------------------------------------------
		// use the leftmouse to steer the gaze
		// behaves identical as in the original script and goes on 
		// the player controller
		// ----------------------------------------------------------
		else if (axes == RotationAxes.MouseX)
		{
			if (Input.GetMouseButton (0)) {
				rotationX += Input.GetAxis("Mouse X") * sensitivityX;
				rotationX = ClampAngle (rotationX, minimumX, maximumX);

				Quaternion xQuaternion = Quaternion.AngleAxis (rotationX, Vector3.up);
				//Quaternion xQuaternion = Quaternion.AxisAngle (Vector3.up, Mathf.Deg2Rad * rotationX);
				transform.localRotation = originalRotation * xQuaternion;
			}
		}
		// ----------------------------------------------------
		// look up or down with lmb and rotate the puppet using rmb
		// the intention is to use this on a null object that is parent
		// to a camera.  
		// ----------------------------------------------------------
		else if (axes == RotationAxes.MouseY)
		{
			if (Input.GetMouseButton (0)) {
				rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
				rotationY = ClampAngle (rotationY, minimumY, maximumY);
				
				Quaternion yQuaternion = Quaternion.AngleAxis (rotationY, Vector3.left);
				//Quaternion yQuaternion = Quaternion.AxisAngle (Vector3.left, Mathf.Deg2Rad * rotationY);
				transform.localRotation = originalRotation * yQuaternion;
			}
			if (Input.GetMouseButton (1) && Input.GetMouseButton (0) == false) {
				rotationX += Input.GetAxis("Mouse X") * sensitivityX;
				rotationX = ClampAngle (rotationX, minimumX, maximumX);
				
				Quaternion xQuaternion = Quaternion.AngleAxis (rotationX, Vector3.up);
				//Quaternion xQuaternion = Quaternion.AxisAngle (Vector3.up, Mathf.Deg2Rad * rotationX);
				transform.localRotation = originalRotation * xQuaternion;
			}
		}
		// ----------------------------------------------------------
	}
	
	void Start ()
	{
		// Make the rigid body not change rotation
		if (GetComponent<Rigidbody>())
			GetComponent<Rigidbody>().freezeRotation = true;
		originalRotation = transform.localRotation;
	}
	
	public static float ClampAngle (float angle, float min, float max)
	{
		// Make the rotation reset after 360 degrees
		if (angle < -360F)
			angle += 360F;
		if (angle > 360F)
			angle -= 360F;
		return Mathf.Clamp (angle, min, max);
	}
}