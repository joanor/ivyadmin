import { reactive, ref } from 'vue'
import { useUserStore, LoginForm } from '@/store/modules/user'
import { FormInstance } from 'element-plus'
import { submitForm } from '@/libs/formAndRules/form'
import { generateFormAndRules } from 'ivy2'
import { formAndRule } from '@/libs/formAndRules/records'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store'

export default function () {
  const userStore = useUserStore()
  const usePermission = usePermissionStore()
  const router = useRouter()
  const [_form, _rules] = generateFormAndRules(
    ['loginName', 'password'],
    formAndRule
  )

  const loginForm = reactive(_form)
  const loginFormRules = reactive(_rules)
  const loginFormRef = ref<FormInstance>()

  const handleLoginForm = submitForm(async (valid?: boolean) => {
    if (valid) {
      userStore
        .loginByUser({
          ...loginForm,
        } as LoginForm)
        .then(res => {
          if (res) {
            router.push('/')
          }
        })
    }
  })

  return {
    loginFormRef,
    loginForm,
    loginFormRules,
    handleLoginForm,
  }
}
