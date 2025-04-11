import{r as n,a as H,c as v,D as O,j as e,B as t,L as p,i as d,N as o,G as U}from"./index-hzS7AP9k.js";import{T as z,f as K,a as Q,b as w,c as i,d as $,e as l}from"./table-bFW6g0Nz.js";import{T as J,D,b as S,c as C,d as P,e as R,f as T}from"./dialog-CP6dT8sS.js";import{E as W}from"./eye-ZMbSUWGe.js";const E={attending:"Attending","not-attending":"Not Attending",undecided:"Undecided"},L={attending:"text-green-600","not-attending":"text-red-600",undecided:"text-yellow-600"},ee=()=>{const[m,x]=n.useState(!1),[g,k]=n.useState(""),[f,A]=n.useState(""),[a,N]=n.useState(null),[G,r]=n.useState(!1),[V,c]=n.useState(!1),[,F]=H();n.useEffect(()=>{(async()=>{try{(await d("GET","/api/admin/rsvps")).ok&&x(!0)}catch{x(!1)}})()},[]);const h=v({mutationFn:async()=>(await d("POST","/api/admin/login",{username:g,password:f})).json(),onSuccess:()=>{x(!0),o({title:"Success",description:"Logged in successfully",variant:"success"})},onError:s=>{o({title:"Error",description:s.message||"Invalid credentials",variant:"destructive"})}}),{data:u,isLoading:q}=O({queryKey:["/api/admin/rsvps"],queryFn:async()=>m?(await d("GET","/api/admin/rsvps")).json():[],enabled:m}),j=v({mutationFn:async s=>(await d("DELETE",`/api/admin/rsvps/${s}`)).json(),onSuccess:()=>{o({title:"Success",description:"RSVP deleted successfully",variant:"success"}),U.invalidateQueries({queryKey:["/api/admin/rsvps"]}),c(!1)},onError:s=>{o({title:"Error",description:s.message||"Failed to delete RSVP",variant:"destructive"})}}),M=s=>{s.preventDefault(),h.mutate()},B=s=>{N(s),r(!0)},y=s=>{N(s),c(!0)},I=()=>{a&&j.mutate(a.id)};return m?e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-center mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold",children:"RSVP Management"}),e.jsx(t,{variant:"outline",className:"mt-4 md:mt-0",onClick:()=>F("/admin/dashboard"),children:"← Back to Dashboard"})]}),q?e.jsx("div",{className:"flex justify-center my-12",children:e.jsx(p,{className:"h-8 w-8 animate-spin text-primary"})}):!u||u.length===0?e.jsx("p",{className:"text-center text-gray-500 my-12",children:"No RSVPs found."}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs(z,{children:[e.jsx(K,{children:"List of all RSVPs"}),e.jsx(Q,{children:e.jsxs(w,{children:[e.jsx(i,{children:"Name"}),e.jsx(i,{children:"Contact Info"}),e.jsx(i,{children:"Status"}),e.jsx(i,{children:"Guests"}),e.jsx(i,{children:"Date"}),e.jsx(i,{children:"Actions"})]})}),e.jsx($,{children:u.map(s=>e.jsxs(w,{children:[e.jsx(l,{className:"font-medium",children:s.name}),e.jsxs(l,{children:[s.email&&e.jsx("div",{children:s.email}),e.jsx("div",{children:s.phone})]}),e.jsx(l,{children:e.jsx("span",{className:L[s.status],children:E[s.status]||s.status})}),e.jsxs(l,{children:[e.jsxs("div",{children:[s.guestCount," total"]}),s.additionalGuests&&e.jsxs("div",{className:"text-xs text-gray-500",children:["+",s.additionalGuests]})]}),e.jsx(l,{children:new Date(s.createdAt).toLocaleDateString()}),e.jsx(l,{children:e.jsxs("div",{className:"flex space-x-2",children:[e.jsx(t,{size:"sm",variant:"outline",onClick:()=>B(s),children:e.jsx(W,{className:"h-4 w-4"})}),e.jsx(t,{size:"sm",variant:"destructive",onClick:()=>y(s),children:e.jsx(J,{className:"h-4 w-4"})})]})})]},s.id))})]})}),e.jsx(D,{open:G,onOpenChange:r,children:e.jsxs(S,{className:"max-w-3xl",children:[e.jsxs(C,{children:[e.jsx(P,{children:"RSVP Details"}),e.jsx(R,{children:"Detailed information for this RSVP"})]}),a&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 py-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Personal Information"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Name:"})," ",a.name]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Email:"})," ",a.email||"Not provided"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Phone:"})," ",a.phone]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Status:"})," ",e.jsx("span",{className:L[a.status],children:E[a.status]||a.status})]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Submitted:"})," ",new Date(a.createdAt).toLocaleString()]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Guests & Preferences"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Total Guests:"})," ",a.guestCount]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Additional Guests:"})," ",a.additionalGuests||"None"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500",children:"Dietary Restrictions:"})," ",a.dietaryRestrictions||"None specified"]}),a.message&&e.jsxs("div",{className:"mt-4",children:[e.jsx("span",{className:"text-gray-500",children:"Message:"}),e.jsx("p",{className:"mt-1 p-2 bg-gray-50 rounded",children:a.message})]})]})]}),e.jsxs(T,{children:[e.jsx(t,{variant:"outline",onClick:()=>r(!1),children:"Close"}),e.jsx(t,{variant:"destructive",onClick:()=>{r(!1),a&&y(a)},children:"Delete RSVP"})]})]})}),e.jsx(D,{open:V,onOpenChange:c,children:e.jsxs(S,{children:[e.jsxs(C,{children:[e.jsx(P,{children:"Confirm Deletion"}),e.jsx(R,{children:"Are you sure you want to delete this RSVP? This action cannot be undone."})]}),e.jsxs(T,{children:[e.jsx(t,{variant:"outline",onClick:()=>c(!1),children:"Cancel"}),e.jsx(t,{variant:"destructive",onClick:I,disabled:j.isPending,children:j.isPending?e.jsxs(e.Fragment,{children:[e.jsx(p,{className:"mr-2 h-4 w-4 animate-spin"}),"Deleting..."]}):"Delete"})]})]})})]}):e.jsxs("div",{className:"container mx-auto p-6 max-w-md",children:[e.jsx("h1",{className:"text-3xl font-bold mb-6 text-center",children:"Admin Login"}),e.jsxs("form",{onSubmit:M,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"username",className:"block text-sm font-medium mb-1",children:"Username"}),e.jsx("input",{type:"text",id:"username",value:g,onChange:s=>k(s.target.value),className:"w-full p-2 border rounded-md",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium mb-1",children:"Password"}),e.jsx("input",{type:"password",id:"password",value:f,onChange:s=>A(s.target.value),className:"w-full p-2 border rounded-md",required:!0})]}),e.jsx(t,{type:"submit",className:"w-full",disabled:h.isPending,children:h.isPending?e.jsxs(e.Fragment,{children:[e.jsx(p,{className:"mr-2 h-4 w-4 animate-spin"}),"Logging in..."]}):"Login"})]})]})};export{ee as default};
