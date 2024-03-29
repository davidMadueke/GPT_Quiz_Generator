import SignInButton from "@/components/ui/SignInButton"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardFooter, CardDescription} from "@/components/ui/card"
import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"


export default async function Home() {
  const session = await getAuthSession()
  if(session?.user){
    // This means the user is logged in
    return redirect("/dashboard")
  }
  return (
      <div className=" absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle>Welcome to Quizmify</CardTitle>

            <CardDescription>
              Quizmify is a quiz app that allows you to create and share quizzes with your friends.
        
          </CardDescription>

          </CardHeader>


          <CardFooter>
            <SignInButton text="Signup with Google" />
          </CardFooter>

        </Card>
      </div>
  )
}
