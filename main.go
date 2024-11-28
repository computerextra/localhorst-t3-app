package main

import (
	"html/template"
	"log"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/basicauth"
)

func main() {
	app := iris.New()

	templ := iris.Pug("./templates", ".pug")
	templ.Reload(true)
	templ.AddFunc("bold", func(s string) (template.HTML, error) {
		return template.HTML("<b>" + s + "</b>"), nil
	})

	opts := basicauth.Options{
		Allow: basicauth.AllowUsersFile("users.yml", basicauth.BCRYPT),
		Realm: basicauth.DefaultRealm,
		// [...more options]
	}

	auth := basicauth.New(opts)

	app.RegisterView(templ)

	app.Use(iris.Compression)

	app.Get("/", index)

	app.Get("/secret", auth, secIndex)

	app.Listen(":8080")
}

func index(ctx iris.Context) {
	if err := ctx.View("index.pug"); err != nil {
		ctx.HTML("<h3>%s</h3>", err.Error())
		return
	}
}

func secIndex(ctx iris.Context) {
	username, password, _ := ctx.Request().BasicAuth()
	log.Fatal(username)
	log.Fatal(password)
	if err := ctx.View("index.pug"); err != nil {
		ctx.HTML("<h3>%s</h3>", err.Error())
		return
	}
}
